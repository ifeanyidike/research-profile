"""Offline tests: import the inspected stdlib-only lab, write only temp fixtures.
No external models, datasets, subprocesses, network or installed packages.
"""
import importlib.util
import math
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('audio_lab', Path(__file__).resolve().parents[2] / 'voice-ai-studio/practice/audio_lab.py')
lab = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lab)


class AudioLabChecks(unittest.TestCase):
    def test_known_tones_and_phase_cancellation(self):
        a = lab.tone(200)
        self.assertEqual(len(a), 16000)
        self.assertAlmostEqual(a[20], 0.25)
        self.assertAlmostEqual(a[40], 0, places=12)
        self.assertTrue(all(x + (-x) == 0 for x in a))
        with self.assertRaises(ValueError):
            lab.tone(8000)

    def test_filter_boundary_and_quantisation(self):
        self.assertEqual(lab.moving_average([2, 4, 0, 2]), [1, 3, 2, 1])
        self.assertEqual(lab.moving_average([]), [])
        self.assertEqual(lab.pcm16([-2, -1, 0, 1, 2]), [-32767, -32767, 0, 32767, 32767])

    def test_transform_retains_phase_and_correct_frequency(self):
        first = lab.dft([1, 0, -1, 0])
        second = lab.dft([0, 1, 0, -1])
        self.assertAlmostEqual(first[1][0], 2)
        self.assertAlmostEqual(first[1][1], 0)
        self.assertAlmostEqual(second[1][0], 0)
        self.assertAlmostEqual(second[1][1], -2)
        self.assertAlmostEqual(math.hypot(*first[1]), math.hypot(*second[1]))
        with self.assertRaises(ValueError):
            lab.dft([])

    def test_generated_audio_headers_report_and_existing_work(self):
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp) / 'lab'
            report = lab.make_lab(folder)
            self.assertEqual(len(list(folder.glob('*.wav'))), 8)
            mono = lab.metadata(folder / 'tone-200.wav')
            stereo = lab.metadata(folder / 'stereo.wav')
            quiet = lab.metadata(folder / 'tone-200-quiet.wav')
            high = lab.metadata(folder / 'tone-400.wav')
            silence = lab.metadata(folder / 'silence.wav')
            self.assertEqual((mono['frames'], mono['rate'], mono['channels'], mono['width']), (16000, 16000, 1, 2))
            self.assertEqual((mono['payload'], mono['file_bytes'], mono['seconds']), (32000, 32044, 1))
            self.assertEqual((stereo['payload'], stereo['seconds'], stereo['channels']), (64000, 1, 2))
            self.assertEqual((mono['peak_bin'], high['peak_bin']), (5, 10))
            self.assertAlmostEqual(quiet['peak'] / mono['peak'], 0.5, delta=0.0001)
            self.assertEqual(silence['peak'], 0)
            self.assertIn('undefined for this all-zero signal', report.read_text())
            self.assertNotIn('<script', report.read_text())
            with self.assertRaises(FileExistsError):
                lab.make_lab(folder)
            self.assertTrue(report.exists())
            with self.assertRaises(ValueError):
                lab.write_wav(Path(temp) / 'bad.wav', [[1, 2], [1]])


if __name__ == '__main__':
    unittest.main()
