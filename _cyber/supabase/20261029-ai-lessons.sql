begin;
alter table public.cyber_progress drop constraint if exists cyber_progress_lesson_id_check;
alter table public.cyber_progress add constraint cyber_progress_lesson_id_check check (lesson_id in ('O01','O02','O03','M01','P01','P02','P03','P04','P05','L01','L02','P06','L03','M02','M03','M04','M05','C01','C02','C03','C04','C05','C06','C07','N01','N02','N03','N04','N05','N06','B01','B02','B03','B04','S01','S02','S03','S04','S05','S06','W01','W02','W03','W04','W05','W06','W07','W08','W09','W10','W11','W12','W13','W14','W15','W16','W17','W18','F01','F02','F03','F04','F05','D01','D02','D03','D04','D05','D06','D07','D08','D09','D10','G01','G02','A01','A02','A03','A04','A05','A06','A07','R01','R02','R03','I01','I02','I03','I04','I05','I06','I07','I08'));
commit;
