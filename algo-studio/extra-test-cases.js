// Generated offline from independent specifications. See _studio/tests/generate-extra-cases.py.
export const extraTestCases = {
  lesson: {
    0: [
      {
        args: [[2, 1, 2], 2],
        expected: 0,
      },
      {
        args: [[1, 2, 3], 3],
        expected: 2,
      },
      {
        args: [[3], 4],
        expected: -1,
      },
      {
        args: [[], 1],
        expected: -1,
      },
      {
        args: [[-3, 1], 0],
        expected: -1,
      },
      {
        args: [[], -1],
        expected: -1,
      },
      {
        args: [[-2, -3, -3, 0], -1],
        expected: -1,
      },
      {
        args: [[3, -2, 0], -3],
        expected: -1,
      },
      {
        args: [[-2, 1, 2, -3], 2],
        expected: 2,
      },
      {
        args: [[-2], -1],
        expected: -1,
      },
      {
        args: [[2, 1, 0], 2],
        expected: 0,
      },
      {
        args: [[-1, 2], -4],
        expected: -1,
      },
    ],
    1: [
      {
        args: [[3]],
        expected: 3,
      },
      {
        args: [[-3, 0]],
        expected: -3,
      },
      {
        args: [[-3, 2, 0, -3, -3, -2]],
        expected: -9,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[-1, 0]],
        expected: -1,
      },
      {
        args: [[-2]],
        expected: -2,
      },
      {
        args: [[-3, -1]],
        expected: -4,
      },
      {
        args: [[0, -2, -1, 3, -2]],
        expected: -2,
      },
      {
        args: [[1, -3, -1, -2, 0]],
        expected: -5,
      },
      {
        args: [[3, 1, -3]],
        expected: 1,
      },
      {
        args: [[2, 2, 1, 1, 1, -3]],
        expected: 4,
      },
      {
        args: [[1, 3]],
        expected: 4,
      },
    ],
    2: [
      {
        args: [[-7, -2, -9]],
        expected: -2,
      },
      {
        args: [[7, 2, 9]],
        expected: 9,
      },
      {
        args: [[4, 4, 4]],
        expected: 4,
      },
      {
        args: [[0, -2, -2, 1, 0, 3]],
        expected: 3,
      },
      {
        args: [[2, -2, -1, 3]],
        expected: 3,
      },
      {
        args: [[-2, -1, -2, -3]],
        expected: -1,
      },
      {
        args: [[-3, -1, -3, 3, 3, 3]],
        expected: 3,
      },
      {
        args: [[2, 1, 0, -3]],
        expected: 2,
      },
      {
        args: [[2, 2, -3, 3, 2, 3]],
        expected: 3,
      },
      {
        args: [[-2, 3]],
        expected: 3,
      },
      {
        args: [[1, -3, -3, -2]],
        expected: 1,
      },
      {
        args: [[2, 0]],
        expected: 2,
      },
    ],
    3: [
      {
        args: ["abca"],
        expected: false,
      },
      {
        args: ["abba"],
        expected: true,
      },
      {
        args: ["abcba"],
        expected: true,
      },
      {
        args: ["Aba"],
        expected: false,
      },
      {
        args: ["b"],
        expected: true,
      },
      {
        args: ["aaabb"],
        expected: false,
      },
      {
        args: ["A"],
        expected: true,
      },
      {
        args: ["AAbb"],
        expected: false,
      },
      {
        args: ["bbbb"],
        expected: true,
      },
      {
        args: ["baa"],
        expected: false,
      },
      {
        args: ["AA"],
        expected: true,
      },
      {
        args: ["bba"],
        expected: false,
      },
    ],
    4: [
      {
        args: [[1, 2, 3], 3],
        expected: 6,
      },
      {
        args: [[0, 0, 1, 2], 3],
        expected: 3,
      },
      {
        args: [[2, 2, 2], 2],
        expected: 4,
      },
      {
        args: [[-9, -4, -2], 1],
        expected: -2,
      },
      {
        args: [[1, 2, 3], 1],
        expected: 3,
      },
      {
        args: [[1, 2, 3], 2],
        expected: 5,
      },
      {
        args: [[], 1],
        expected: null,
      },
      {
        args: [[1], -1],
        expected: null,
      },
      {
        args: [[1], 2],
        expected: null,
      },
      {
        args: [[0, 1, -2, 2], 0],
        expected: null,
      },
      {
        args: [[1], 3],
        expected: null,
      },
      {
        args: [[0], 8],
        expected: null,
      },
    ],
    5: [
      {
        args: [
          [2, -3, 4],
          [
            [0, 0],
            [2, 2],
            [0, 2],
            [1, 2],
          ],
        ],
        expected: [2, 4, 3, 1],
      },
      {
        args: [
          [-3, -2, -3, -2],
          [
            [0, 1],
            [0, 1],
            [3, 3],
          ],
        ],
        expected: [-5, -5, -2],
      },
      {
        args: [
          [0, 0, 2],
          [
            [1, 1],
            [0, 1],
            [1, 1],
          ],
        ],
        expected: [0, 0, 0],
      },
      {
        args: [
          [-2, 2],
          [
            [1, 1],
            [1, 1],
            [0, 1],
          ],
        ],
        expected: [2, 2, 0],
      },
      {
        args: [
          [-3, 1, 3, 0, -1],
          [
            [4, 4],
            [0, 4],
            [1, 1],
          ],
        ],
        expected: [-1, 0, 1],
      },
      {
        args: [
          [-1, -2],
          [
            [0, 1],
            [0, 1],
            [0, 1],
          ],
        ],
        expected: [-3, -3, -3],
      },
      {
        args: [
          [-1, -3, 1, 2, -2, -2],
          [
            [1, 3],
            [2, 5],
            [4, 5],
          ],
        ],
        expected: [0, -1, -4],
      },
      {
        args: [
          [-1],
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [-1, -1, -1],
      },
      {
        args: [
          [-3, 2, 3],
          [
            [0, 2],
            [1, 2],
            [2, 2],
          ],
        ],
        expected: [2, 5, 3],
      },
      {
        args: [
          [3],
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [3, 3, 3],
      },
      {
        args: [
          [-1, -3, 3],
          [
            [1, 1],
            [1, 2],
            [1, 2],
          ],
        ],
        expected: [-3, 0, 0],
      },
      {
        args: [
          [-3, -2, 2, -3, 3],
          [
            [2, 4],
            [2, 4],
            [0, 1],
          ],
        ],
        expected: [2, 2, -5],
      },
    ],
    6: [
      {
        args: [[1, 3, 7], 7],
        expected: 2,
      },
      {
        args: [[1, 3, 7], 8],
        expected: -1,
      },
      {
        args: [[], -4],
        expected: -1,
      },
      {
        args: [[], -2],
        expected: -1,
      },
      {
        args: [[-3, 1, 3], 1],
        expected: 1,
      },
      {
        args: [[-3], 0],
        expected: -1,
      },
      {
        args: [[-3, 2], 3],
        expected: -1,
      },
      {
        args: [[1, 3], 3],
        expected: 1,
      },
      {
        args: [[-1], 4],
        expected: -1,
      },
      {
        args: [[-3, 3], 3],
        expected: 1,
      },
      {
        args: [[-2, 1], 0],
        expected: -1,
      },
      {
        args: [[-3, -2, -1, 1, 3], 0],
        expected: -1,
      },
    ],
    7: [
      {
        args: [[3, 3, 1]],
        expected: [1, 3, 3],
      },
      {
        args: [[-2, -3]],
        expected: [-3, -2],
      },
      {
        args: [[1, 3, 2, 2]],
        expected: [1, 2, 2, 3],
      },
      {
        args: [[2, 2, -1, -1]],
        expected: [-1, -1, 2, 2],
      },
      {
        args: [[-3, -2, 0, -3, 1, 0]],
        expected: [-3, -3, -2, 0, 0, 1],
      },
      {
        args: [[2, 0]],
        expected: [0, 2],
      },
      {
        args: [[-3, 2, -3, -3]],
        expected: [-3, -3, -3, 2],
      },
      {
        args: [[-1, -1, 0]],
        expected: [-1, -1, 0],
      },
      {
        args: [[-1, -1, -3, 3]],
        expected: [-3, -1, -1, 3],
      },
      {
        args: [[-1, 0]],
        expected: [-1, 0],
      },
      {
        args: [[-2]],
        expected: [-2],
      },
      {
        args: [[2, 2, -2, -3, 2, 1]],
        expected: [-3, -2, 1, 2, 2, 2],
      },
    ],
    8: [
      {
        args: [[1], []],
        expected: [1],
      },
      {
        args: [[], [1]],
        expected: [1],
      },
      {
        args: [
          [1, 1],
          [1, 1, 1],
        ],
        expected: [1, 1, 1, 1, 1],
      },
      {
        args: [
          [1, 2, 5, 8],
          [2, 8],
        ],
        expected: [1, 2, 2, 5, 8, 8],
      },
      {
        args: [[1], [2, 3, 4]],
        expected: [1, 2, 3, 4],
      },
      {
        args: [
          [-3, -1],
          [-4, -3, -1, 0],
        ],
        expected: [-4, -3, -3, -1, -1, 0],
      },
      {
        args: [[], [-2]],
        expected: [-2],
      },
      {
        args: [
          [-3, -2, 2, 2],
          [-4, -2, 2],
        ],
        expected: [-4, -3, -2, -2, 2, 2, 2],
      },
      {
        args: [
          [-3, -1, 1, 2],
          [-1, 2, 2],
        ],
        expected: [-3, -1, -1, 1, 2, 2, 2],
      },
      {
        args: [
          [-3, -2, -1, 0, 0, 2],
          [-2, -1, 0, 3],
        ],
        expected: [-3, -2, -2, -1, -1, 0, 0, 0, 2, 3],
      },
      {
        args: [
          [-2, 3],
          [2, 3],
        ],
        expected: [-2, 2, 3, 3],
      },
      {
        args: [
          [-2, 0, 0, 2],
          [-1, 0, 2],
        ],
        expected: [-2, -1, 0, 0, 0, 2, 2],
      },
    ],
    9: [
      {
        args: ["))(("],
        expected: false,
      },
      {
        args: ["()"],
        expected: true,
      },
      {
        args: ["((()("],
        expected: false,
      },
      {
        args: ["(()))"],
        expected: false,
      },
      {
        args: ["(((()("],
        expected: false,
      },
      {
        args: [")))(())("],
        expected: false,
      },
      {
        args: ["(()("],
        expected: false,
      },
      {
        args: ["))))(("],
        expected: false,
      },
      {
        args: ["("],
        expected: false,
      },
      {
        args: [")(()))("],
        expected: false,
      },
      {
        args: ["((()))"],
        expected: true,
      },
      {
        args: [")()))))"],
        expected: false,
      },
    ],
    10: [
      {
        args: [[["take"], ["add", 4], ["take"], ["take"], ["add", 1], ["take"], ["take"], ["add", 3]]],
        expected: [null, 4, null, 1, null],
      },
      {
        args: [[["add", 1], ["add", 0], ["add", 4], ["take"], ["take"], ["add", 4], ["add", 2], ["take"]]],
        expected: [1, 0, 4],
      },
      {
        args: [[["add", 1], ["add", 3], ["add", 0], ["take"], ["take"], ["take"], ["take"], ["take"]]],
        expected: [1, 3, 0, null, null],
      },
      {
        args: [[["add", 1], ["take"], ["add", 3], ["add", 3], ["add", 4], ["add", 4], ["add", 3], ["take"]]],
        expected: [1, 3],
      },
      {
        args: [[["take"], ["take"], ["add", 3], ["add", 3], ["take"], ["take"], ["take"], ["take"]]],
        expected: [null, null, 3, 3, null, null],
      },
      {
        args: [[["take"], ["add", 3], ["take"], ["take"], ["take"], ["add", 0], ["add", 3], ["add", 2]]],
        expected: [null, 3, null, null],
      },
      {
        args: [[["take"], ["take"], ["take"], ["take"], ["take"], ["take"], ["take"], ["take"]]],
        expected: [null, null, null, null, null, null, null, null],
      },
      {
        args: [[["take"], ["add", 3], ["add", 3], ["take"], ["take"], ["take"], ["add", 0], ["add", 4]]],
        expected: [null, 3, 3, null],
      },
      {
        args: [[["take"], ["add", 1], ["add", 2], ["add", 1], ["take"], ["take"], ["add", 1], ["take"]]],
        expected: [null, 1, 2, 1],
      },
      {
        args: [[["add", 0], ["add", 3], ["take"], ["add", 2], ["add", 0], ["add", 2], ["add", 3], ["take"]]],
        expected: [0, 3],
      },
      {
        args: [[["take"], ["take"], ["add", 1], ["add", 1], ["add", 0], ["add", 4], ["take"], ["add", 1]]],
        expected: [null, null, 1],
      },
      {
        args: [[["take"], ["take"], ["take"], ["add", 4], ["add", 0], ["add", 0], ["take"], ["take"]]],
        expected: [null, null, null, 4, 0],
      },
    ],
    11: [
      {
        args: [
          {
            value: -3,
            next: {
              value: -3,
              next: {
                value: -2,
                next: null,
              },
            },
          },
        ],
        expected: [-3, -3, -2],
      },
      {
        args: [
          {
            value: 3,
            next: {
              value: -1,
              next: null,
            },
          },
        ],
        expected: [3, -1],
      },
      {
        args: [
          {
            value: -2,
            next: {
              value: -1,
              next: {
                value: 1,
                next: {
                  value: -1,
                  next: null,
                },
              },
            },
          },
        ],
        expected: [-2, -1, 1, -1],
      },
      {
        args: [
          {
            value: 2,
            next: {
              value: 1,
              next: {
                value: 2,
                next: {
                  value: 3,
                  next: null,
                },
              },
            },
          },
        ],
        expected: [2, 1, 2, 3],
      },
      {
        args: [
          {
            value: 2,
            next: {
              value: -3,
              next: {
                value: -2,
                next: null,
              },
            },
          },
        ],
        expected: [2, -3, -2],
      },
      {
        args: [
          {
            value: 3,
            next: {
              value: -3,
              next: {
                value: 2,
                next: {
                  value: -3,
                  next: null,
                },
              },
            },
          },
        ],
        expected: [3, -3, 2, -3],
      },
      {
        args: [
          {
            value: -3,
            next: {
              value: 0,
              next: {
                value: -3,
                next: {
                  value: -2,
                  next: {
                    value: 0,
                    next: null,
                  },
                },
              },
            },
          },
        ],
        expected: [-3, 0, -3, -2, 0],
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: 2,
              next: null,
            },
          },
        ],
        expected: [1, 2],
      },
      {
        args: [
          {
            value: 0,
            next: {
              value: 1,
              next: {
                value: -3,
                next: null,
              },
            },
          },
        ],
        expected: [0, 1, -3],
      },
      {
        args: [
          {
            value: -2,
            next: {
              value: 0,
              next: {
                value: 1,
                next: {
                  value: -1,
                  next: {
                    value: 3,
                    next: null,
                  },
                },
              },
            },
          },
        ],
        expected: [-2, 0, 1, -1, 3],
      },
      {
        args: [
          {
            value: -1,
            next: {
              value: 2,
              next: {
                value: -2,
                next: {
                  value: 2,
                  next: {
                    value: -1,
                    next: {
                      value: 1,
                      next: null,
                    },
                  },
                },
              },
            },
          },
        ],
        expected: [-1, 2, -2, 2, -1, 1],
      },
      {
        args: [
          {
            value: -1,
            next: {
              value: 2,
              next: {
                value: 3,
                next: {
                  value: 2,
                  next: null,
                },
              },
            },
          },
        ],
        expected: [-1, 2, 3, 2],
      },
    ],
    12: [
      {
        args: [["A", "a", "A", ""]],
        expected: {
          A: 2,
          a: 1,
          "": 1,
        },
      },
      {
        args: [["b", "b", "a", "A", "A"]],
        expected: {
          b: 2,
          a: 1,
          A: 2,
        },
      },
      {
        args: [["", "a"]],
        expected: {
          "": 1,
          a: 1,
        },
      },
      {
        args: [["A", "b", "", "a", ""]],
        expected: {
          A: 1,
          b: 1,
          "": 2,
          a: 1,
        },
      },
      {
        args: [["a", "", "ab"]],
        expected: {
          a: 1,
          "": 1,
          ab: 1,
        },
      },
      {
        args: [["A", "b", "ab", "a", "a"]],
        expected: {
          A: 1,
          b: 1,
          ab: 1,
          a: 2,
        },
      },
      {
        args: [["a", "", "", "ab"]],
        expected: {
          a: 1,
          "": 2,
          ab: 1,
        },
      },
      {
        args: [["A", "ab"]],
        expected: {
          A: 1,
          ab: 1,
        },
      },
      {
        args: [["", "ab", "A"]],
        expected: {
          "": 1,
          ab: 1,
          A: 1,
        },
      },
      {
        args: [["A", ""]],
        expected: {
          A: 1,
          "": 1,
        },
      },
      {
        args: [["ab", "a"]],
        expected: {
          ab: 1,
          a: 1,
        },
      },
      {
        args: [["A", "A", "a"]],
        expected: {
          A: 2,
          a: 1,
        },
      },
    ],
    13: [
      {
        args: [[3], 6],
        expected: [],
      },
      {
        args: [[3, 3], 6],
        expected: [0, 1],
      },
      {
        args: [[2, 0, -1], 3],
        expected: [],
      },
      {
        args: [[-1, -2, 1], 1],
        expected: [],
      },
      {
        args: [[], 1],
        expected: [],
      },
      {
        args: [[0, -3], 4],
        expected: [],
      },
      {
        args: [[-2, 0, -3], 4],
        expected: [],
      },
      {
        args: [[], -1],
        expected: [],
      },
      {
        args: [[2], 3],
        expected: [],
      },
      {
        args: [[0], 4],
        expected: [],
      },
      {
        args: [[-3, -2, -2], -4],
        expected: [1, 2],
      },
      {
        args: [[-2, -2, 3, 3, 2, -1], -1],
        expected: [],
      },
    ],
    14: [
      {
        args: [15],
        expected: 1307674368000,
      },
      {
        args: [12],
        expected: 479001600,
      },
      {
        args: [3],
        expected: 6,
      },
      {
        args: [4],
        expected: 24,
      },
      {
        args: [13],
        expected: 6227020800,
      },
      {
        args: [10],
        expected: 3628800,
      },
      {
        args: [11],
        expected: 39916800,
      },
      {
        args: [9],
        expected: 362880,
      },
      {
        args: [7],
        expected: 5040,
      },
      {
        args: [2],
        expected: 2,
      },
      {
        args: [14],
        expected: 87178291200,
      },
      {
        args: [6],
        expected: 720,
      },
    ],
    15: [
      {
        args: [
          {
            value: 3,
            left: {
              value: -2,
              left: null,
              right: null,
            },
            right: {
              value: 8,
              left: {
                value: 5,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: [-2, 3, 5, 8],
      },
      {
        args: [
          {
            value: 5,
            left: null,
            right: null,
          },
        ],
        expected: [5],
      },
      {
        args: [
          {
            value: -3,
            left: null,
            right: {
              value: 8,
              left: {
                value: 5,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: [-3, 5, 8],
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: -5,
              left: null,
              right: {
                value: 8,
                left: {
                  value: 2,
                  left: {
                    value: -1,
                    left: null,
                    right: {
                      value: 0,
                      left: null,
                      right: null,
                    },
                  },
                  right: null,
                },
                right: null,
              },
            },
          },
        ],
        expected: [-6, -5, -1, 0, 2, 8],
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: 2,
              left: {
                value: 0,
                left: {
                  value: -7,
                  left: null,
                  right: {
                    value: -3,
                    left: {
                      value: -5,
                      left: null,
                      right: null,
                    },
                    right: null,
                  },
                },
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: [-8, -7, -5, -3, 0, 2],
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 2,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: [2, 5],
      },
      {
        args: [
          {
            value: -5,
            left: {
              value: -8,
              left: null,
              right: {
                value: -7,
                left: null,
                right: null,
              },
            },
            right: {
              value: 8,
              left: {
                value: -4,
                left: null,
                right: {
                  value: -2,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
          },
        ],
        expected: [-8, -7, -5, -4, -2, 8],
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: 7,
              left: {
                value: -2,
                left: null,
                right: {
                  value: 1,
                  left: {
                    value: 0,
                    left: null,
                    right: null,
                  },
                  right: {
                    value: 6,
                    left: null,
                    right: null,
                  },
                },
              },
              right: null,
            },
            right: null,
          },
        ],
        expected: [-2, 0, 1, 6, 7, 8],
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 0,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        ],
        expected: [-8, 0, 5, 8],
      },
      {
        args: [
          {
            value: 7,
            left: null,
            right: null,
          },
        ],
        expected: [7],
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: 2,
              left: null,
              right: null,
            },
          },
        ],
        expected: [-6, 2],
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: -1,
              left: {
                value: -7,
                left: null,
                right: {
                  value: -4,
                  left: null,
                  right: {
                    value: -2,
                    left: null,
                    right: null,
                  },
                },
              },
              right: {
                value: 4,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: [-7, -4, -2, -1, 4, 5],
      },
    ],
    16: [
      {
        args: [
          {
            value: 1,
            left: null,
            right: null,
          },
          -1,
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -2,
              left: null,
              right: null,
            },
            right: {
              value: 7,
              left: {
                value: 6,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          3,
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -2,
            left: {
              value: -4,
              left: {
                value: -6,
                left: null,
                right: {
                  value: -5,
                  left: null,
                  right: null,
                },
              },
              right: {
                value: -3,
                left: null,
                right: null,
              },
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
          -2,
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -5,
            left: null,
            right: null,
          },
          1,
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -1,
              left: {
                value: -4,
                left: {
                  value: -5,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: {
              value: 8,
              left: {
                value: 5,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          1,
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 1,
            left: null,
            right: null,
          },
          2,
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -3,
              left: {
                value: -6,
                left: null,
                right: null,
              },
              right: {
                value: -1,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          3,
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -5,
              left: {
                value: -7,
                left: null,
                right: null,
              },
              right: {
                value: -2,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          -1,
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: -5,
              left: null,
              right: {
                value: -3,
                left: null,
                right: null,
              },
            },
          },
          0,
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: -1,
              left: null,
              right: null,
            },
          },
          3,
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -3,
            left: null,
            right: {
              value: 4,
              left: {
                value: -1,
                left: null,
                right: null,
              },
              right: {
                value: 5,
                left: null,
                right: {
                  value: 6,
                  left: null,
                  right: null,
                },
              },
            },
          },
          1,
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -8,
              left: null,
              right: {
                value: -3,
                left: null,
                right: null,
              },
            },
            right: {
              value: 0,
              left: null,
              right: {
                value: 5,
                left: null,
                right: {
                  value: 7,
                  left: null,
                  right: null,
                },
              },
            },
          },
          -1,
        ],
        expected: true,
      },
    ],
    17: [
      {
        args: [[-2, -1, -3, -2], 3],
        expected: [-3, -2, -2],
      },
      {
        args: [[-3, 2, 2, -1], 4],
        expected: [-3, -1, 2, 2],
      },
      {
        args: [[-1], 1],
        expected: [-1],
      },
      {
        args: [[0, 3, -3, 0, 0, -1], 3],
        expected: [-3, -1, 0],
      },
      {
        args: [[-2, 1, -1], 0],
        expected: [],
      },
      {
        args: [[3, -3, -3, -2], 2],
        expected: [-3, -3],
      },
      {
        args: [[-1, -1, -3, -2, -1], 4],
        expected: [-3, -2, -1, -1],
      },
      {
        args: [[-2, -2], 0],
        expected: [],
      },
      {
        args: [[1, 0, -2, 0, 0], 3],
        expected: [-2, 0, 0],
      },
      {
        args: [[2, 1, 1, -3, -3], 4],
        expected: [-3, -3, 1, 1],
      },
      {
        args: [[2], 1],
        expected: [2],
      },
      {
        args: [[-1, 0, 0, 0, -2], 3],
        expected: [-2, -1, 0],
      },
    ],
    18: [
      {
        args: [{}, "A", "B"],
        expected: -1,
      },
      {
        args: [
          {
            A: ["C", "B"],
            B: ["C", "A"],
          },
          "C",
          "A",
        ],
        expected: -1,
      },
      {
        args: [{}, "D", "B"],
        expected: -1,
      },
      {
        args: [
          {
            A: ["D", "A", "B"],
            B: [],
          },
          "D",
          "A",
        ],
        expected: -1,
      },
      {
        args: [
          {
            A: [],
            B: ["A", "B"],
            C: [],
          },
          "C",
          "C",
        ],
        expected: 0,
      },
      {
        args: [{}, "B", "C"],
        expected: -1,
      },
      {
        args: [
          {
            A: ["B"],
            B: ["A", "B", "D"],
          },
          "A",
          "D",
        ],
        expected: 2,
      },
      {
        args: [
          {
            A: ["D", "A", "B"],
            B: ["A", "B"],
            C: ["B"],
          },
          "A",
          "A",
        ],
        expected: 0,
      },
      {
        args: [
          {
            A: [],
            B: [],
          },
          "A",
          "D",
        ],
        expected: -1,
      },
      {
        args: [
          {
            A: ["C"],
          },
          "C",
          "B",
        ],
        expected: -1,
      },
      {
        args: [
          {
            A: ["A"],
            B: ["B", "C", "D", "A"],
            C: ["B", "D", "A", "C"],
          },
          "A",
          "D",
        ],
        expected: -1,
      },
      {
        args: [
          {
            A: ["A", "B"],
            B: ["B", "D", "A", "C"],
          },
          "C",
          "D",
        ],
        expected: -1,
      },
    ],
    19: [
      {
        args: [
          {
            A: ["A", "D", "C"],
            B: [],
          },
          "A",
        ],
        expected: ["A", "C", "D"],
      },
      {
        args: [
          {
            A: [],
            B: ["D", "A", "B", "C"],
          },
          "B",
        ],
        expected: ["A", "B", "C", "D"],
      },
      {
        args: [
          {
            A: ["B", "D"],
            B: ["B", "A"],
            C: ["A", "C"],
          },
          "B",
        ],
        expected: ["A", "B", "D"],
      },
      {
        args: [
          {
            A: ["D"],
          },
          "C",
        ],
        expected: ["C"],
      },
      {
        args: [
          {
            A: [],
            B: ["A", "B", "D"],
            C: ["B", "C", "A"],
            D: ["B", "C"],
          },
          "D",
        ],
        expected: ["A", "B", "C", "D"],
      },
      {
        args: [{}, "D"],
        expected: ["D"],
      },
      {
        args: [{}, "B"],
        expected: ["B"],
      },
      {
        args: [
          {
            A: ["A", "C", "D"],
            B: [],
            C: ["A", "B", "C"],
          },
          "B",
        ],
        expected: ["B"],
      },
      {
        args: [
          {
            A: ["A", "D", "B", "C"],
          },
          "B",
        ],
        expected: ["B"],
      },
      {
        args: [{}, "C"],
        expected: ["C"],
      },
      {
        args: [
          {
            A: ["D", "C", "B", "A"],
            B: ["A"],
            C: ["A", "D"],
          },
          "B",
        ],
        expected: ["A", "B", "C", "D"],
      },
      {
        args: [
          {
            A: ["B", "D"],
            B: [],
            C: ["B", "D", "A", "C"],
          },
          "C",
        ],
        expected: ["A", "B", "C", "D"],
      },
    ],
    20: [
      {
        args: [
          [
            [1, 2],
            [2, 3],
            [1, 10],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [0, 1],
            [0, 1],
            [-4, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [-3, -2],
            [-4, 1],
            [-4, -3],
            [-1, 0],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [
            [2, 3],
            [-4, -2],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [-2, 4],
            [-3, -1],
            [-3, 5],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [0, 1],
            [-3, 3],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [4, 5],
            [-2, -1],
            [3, 5],
            [1, 2],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [
            [-4, 5],
            [-1, 3],
            [-1, 5],
            [0, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [0, 2],
            [-3, 5],
          ],
        ],
        expected: 1,
      },
      {
        args: [[[-4, 0]]],
        expected: 1,
      },
      {
        args: [
          [
            [-1, 5],
            [-3, 1],
            [0, 5],
            [0, 4],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [0, 5],
            [2, 5],
            [-1, 2],
            [-3, -1],
          ],
        ],
        expected: 3,
      },
    ],
    21: [
      {
        args: [40],
        expected: 165580141,
      },
      {
        args: [9],
        expected: 55,
      },
      {
        args: [12],
        expected: 233,
      },
      {
        args: [13],
        expected: 377,
      },
      {
        args: [8],
        expected: 34,
      },
      {
        args: [5],
        expected: 8,
      },
      {
        args: [7],
        expected: 21,
      },
      {
        args: [3],
        expected: 3,
      },
      {
        args: [14],
        expected: 610,
      },
      {
        args: [15],
        expected: 987,
      },
      {
        args: [6],
        expected: 13,
      },
      {
        args: [2],
        expected: 2,
      },
    ],
    22: [
      {
        args: [[], 3],
        expected: -1,
      },
      {
        args: [[2, 4, 3], 11],
        expected: 3,
      },
      {
        args: [[4, 3, 1], 4],
        expected: 1,
      },
      {
        args: [[3], 11],
        expected: -1,
      },
      {
        args: [[1, 3], 1],
        expected: 1,
      },
      {
        args: [[3, 1], 11],
        expected: 5,
      },
      {
        args: [[3, 1, 4, 2], 4],
        expected: 1,
      },
      {
        args: [[4, 3], 3],
        expected: 1,
      },
      {
        args: [[2], 10],
        expected: 5,
      },
      {
        args: [[1, 4, 2], 5],
        expected: 2,
      },
      {
        args: [[], 11],
        expected: -1,
      },
      {
        args: [[4, 1], 2],
        expected: 2,
      },
    ],
    23: [
      {
        args: [{}, "A", "B"],
        expected: [],
      },
      {
        args: [
          {
            A: ["A", "D"],
          },
          "C",
          "D",
        ],
        expected: [],
      },
      {
        args: [{}, "A", "D"],
        expected: [],
      },
      {
        args: [{}, "D", "A"],
        expected: [],
      },
      {
        args: [{}, "D", "B"],
        expected: [],
      },
      {
        args: [
          {
            A: ["A"],
            B: ["B", "C"],
            C: [],
            D: ["D", "C", "A", "B"],
          },
          "B",
          "B",
        ],
        expected: ["B"],
      },
      {
        args: [
          {
            A: ["C", "B", "D", "A"],
            B: ["A", "D", "B"],
          },
          "C",
          "B",
        ],
        expected: [],
      },
      {
        args: [
          {
            A: ["B", "D"],
          },
          "C",
          "C",
        ],
        expected: ["C"],
      },
      {
        args: [
          {
            A: ["B"],
            B: ["D", "B", "C", "A"],
          },
          "B",
          "A",
        ],
        expected: ["B", "A"],
      },
      {
        args: [
          {
            A: ["A", "B", "C", "D"],
            B: ["D", "B"],
            C: [],
          },
          "C",
          "C",
        ],
        expected: ["C"],
      },
      {
        args: [
          {
            A: ["C"],
          },
          "D",
          "C",
        ],
        expected: [],
      },
      {
        args: [
          {
            A: ["D", "B", "C"],
            B: ["A", "D"],
          },
          "A",
          "C",
        ],
        expected: ["A", "C"],
      },
    ],
    24: [
      {
        args: [[3, 1]],
        expected: [1, 3],
      },
      {
        args: [[0, 2, 0, -2, 2, 1]],
        expected: [-2, 0, 0, 1, 2, 2],
      },
      {
        args: [[3, 1, -1]],
        expected: [-1, 1, 3],
      },
      {
        args: [[3, -3, 3, -3, 1]],
        expected: [-3, -3, 1, 3, 3],
      },
      {
        args: [[-3, 1, -3, -1, -3, -3]],
        expected: [-3, -3, -3, -3, -1, 1],
      },
      {
        args: [[3]],
        expected: [3],
      },
      {
        args: [[-1, 2, -2, -2, 1]],
        expected: [-2, -2, -1, 1, 2],
      },
      {
        args: [[2, -3, 2]],
        expected: [-3, 2, 2],
      },
      {
        args: [[0, -2]],
        expected: [-2, 0],
      },
      {
        args: [[2, -3, 2, -3]],
        expected: [-3, -3, 2, 2],
      },
      {
        args: [[1, 0, 0]],
        expected: [0, 0, 1],
      },
      {
        args: [[-1, 1, -1]],
        expected: [-1, -1, 1],
      },
    ],
    25: [
      {
        args: [[-2, -2, 0]],
        expected: [-2, -2, 0],
      },
      {
        args: [[-2, -2, -2]],
        expected: [-2, -2, -2],
      },
      {
        args: [[2, 2]],
        expected: [2, 2],
      },
      {
        args: [[-3]],
        expected: [-3],
      },
      {
        args: [[3, 2, -3, -3, -2, 3]],
        expected: [-3, -3, -2, 2, 3, 3],
      },
      {
        args: [[-3, 3, -1]],
        expected: [-3, -1, 3],
      },
      {
        args: [[-2, -2, -2, 2, 3]],
        expected: [-2, -2, -2, 2, 3],
      },
      {
        args: [[-2, -2, 1]],
        expected: [-2, -2, 1],
      },
      {
        args: [[-1, -3, 0, -3, 2, -3]],
        expected: [-3, -3, -3, -1, 0, 2],
      },
      {
        args: [[0, -2, -3, -1, -3]],
        expected: [-3, -3, -2, -1, 0],
      },
      {
        args: [[-2, -3]],
        expected: [-3, -2],
      },
      {
        args: [[1, 1, -1, -3, -1]],
        expected: [-3, -1, -1, 1, 1],
      },
    ],
    26: [
      {
        args: [[-3, 3]],
        expected: [[], [-3], [-3, 3], [3]],
      },
      {
        args: [[1, -1]],
        expected: [[], [-1], [1], [1, -1]],
      },
      {
        args: [[1, 0]],
        expected: [[], [0], [1], [1, 0]],
      },
      {
        args: [[1, -2, -1]],
        expected: [[], [-2], [-2, -1], [-1], [1], [1, -2], [1, -2, -1], [1, -1]],
      },
      {
        args: [[1, 3, -2, 0]],
        expected: [
          [],
          [-2],
          [-2, 0],
          [0],
          [1],
          [1, -2],
          [1, -2, 0],
          [1, 0],
          [1, 3],
          [1, 3, -2],
          [1, 3, -2, 0],
          [1, 3, 0],
          [3],
          [3, -2],
          [3, -2, 0],
          [3, 0],
        ],
      },
      {
        args: [[1, 3, -3]],
        expected: [[], [-3], [1], [1, -3], [1, 3], [1, 3, -3], [3], [3, -3]],
      },
      {
        args: [[0]],
        expected: [[], [0]],
      },
      {
        args: [[3, -2, 2]],
        expected: [[], [-2], [-2, 2], [2], [3], [3, -2], [3, -2, 2], [3, 2]],
      },
      {
        args: [[3, -1, 2, 1, -2]],
        expected: [
          [],
          [-2],
          [-1],
          [-1, -2],
          [-1, 1],
          [-1, 1, -2],
          [-1, 2],
          [-1, 2, -2],
          [-1, 2, 1],
          [-1, 2, 1, -2],
          [1],
          [1, -2],
          [2],
          [2, -2],
          [2, 1],
          [2, 1, -2],
          [3],
          [3, -2],
          [3, -1],
          [3, -1, -2],
          [3, -1, 1],
          [3, -1, 1, -2],
          [3, -1, 2],
          [3, -1, 2, -2],
          [3, -1, 2, 1],
          [3, -1, 2, 1, -2],
          [3, 1],
          [3, 1, -2],
          [3, 2],
          [3, 2, -2],
          [3, 2, 1],
          [3, 2, 1, -2],
        ],
      },
      {
        args: [[-1]],
        expected: [[], [-1]],
      },
      {
        args: [[0, 1, -2, 2]],
        expected: [
          [],
          [-2],
          [-2, 2],
          [0],
          [0, -2],
          [0, -2, 2],
          [0, 1],
          [0, 1, -2],
          [0, 1, -2, 2],
          [0, 1, 2],
          [0, 2],
          [1],
          [1, -2],
          [1, -2, 2],
          [1, 2],
          [2],
        ],
      },
      {
        args: [[-2]],
        expected: [[], [-2]],
      },
    ],
    27: [
      {
        args: [[], ["", "a"]],
        expected: [true, false],
      },
      {
        args: [["car"], ["ca", "car", "cart"]],
        expected: [true, true, false],
      },
      {
        args: [
          ["a", ""],
          ["", "", ""],
        ],
        expected: [true, true, true],
      },
      {
        args: [
          ["ab", "a", "", "a", "b"],
          ["z", "ab", ""],
        ],
        expected: [false, true, true],
      },
      {
        args: [
          ["a", "a", "", "a", "ab", "a"],
          ["z", "", "a"],
        ],
        expected: [false, true, true],
      },
      {
        args: [
          ["", "a", "a", "b", "b", "b"],
          ["z", "a", "a"],
        ],
        expected: [false, true, true],
      },
      {
        args: [
          ["ab", "a", "a", "ab"],
          ["z", "a", "z"],
        ],
        expected: [false, true, false],
      },
      {
        args: [[], ["", "", "a"]],
        expected: [true, true, false],
      },
      {
        args: [
          ["a", "a", "b", "b"],
          ["z", "ab", "z"],
        ],
        expected: [false, false, false],
      },
      {
        args: [["ab"], ["z", "z", ""]],
        expected: [false, false, true],
      },
      {
        args: [
          ["ab", "a", "ab", "b", "a", ""],
          ["z", "", "a"],
        ],
        expected: [false, true, true],
      },
      {
        args: [
          ["a", "a", "a"],
          ["ab", "a", "ab"],
        ],
        expected: [false, true, false],
      },
    ],
    28: [
      {
        args: [
          4,
          [
            [0, 0],
            [0, 1],
            [0, 1],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [2, 1],
            [0, 2],
            [1, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          4,
          [
            [3, 3],
            [2, 0],
            [0, 1],
            [3, 3],
            [0, 3],
            [2, 3],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [2, 3],
            [0, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          2,
          [
            [0, 1],
            [0, 0],
            [1, 0],
            [0, 0],
            [1, 1],
            [1, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [1, [[0, 0]]],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [2, 2],
            [3, 1],
            [0, 1],
            [2, 0],
            [2, 2],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [4, []],
        expected: 4,
      },
    ],
    29: [
      {
        args: [
          4,
          [
            [3, 2],
            [3, 0],
            [3, 1],
            [2, 2],
          ],
        ],
        expected: true,
      },
      {
        args: [4, []],
        expected: false,
      },
      {
        args: [3, [[2, 1]]],
        expected: false,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: true,
      },
      {
        args: [
          3,
          [
            [0, 0],
            [1, 2],
            [1, 0],
            [0, 1],
            [2, 1],
            [2, 0],
          ],
        ],
        expected: true,
      },
      {
        args: [
          3,
          [
            [2, 2],
            [2, 2],
            [1, 2],
            [1, 1],
            [1, 1],
          ],
        ],
        expected: true,
      },
      {
        args: [
          4,
          [
            [2, 1],
            [1, 0],
          ],
        ],
        expected: false,
      },
      {
        args: [
          4,
          [
            [1, 3],
            [1, 1],
            [0, 0],
            [0, 0],
            [3, 0],
          ],
        ],
        expected: true,
      },
      {
        args: [
          2,
          [
            [0, 1],
            [1, 1],
            [0, 0],
            [0, 1],
          ],
        ],
        expected: true,
      },
      {
        args: [
          4,
          [
            [0, 0],
            [3, 0],
            [2, 0],
            [1, 3],
          ],
        ],
        expected: true,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: true,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: true,
      },
    ],
    30: [
      {
        args: [
          {
            A: [
              ["B", 8],
              ["C", 1],
            ],
            C: [["B", 1]],
          },
          "A",
          "B",
        ],
        expected: 2,
      },
      {
        args: [{}, "D", "C"],
        expected: -1,
      },
      {
        args: [
          {
            A: [
              ["B", 4],
              ["A", 3],
            ],
            B: [
              ["C", 3],
              ["B", 0],
            ],
            C: [["C", 5]],
          },
          "D",
          "B",
        ],
        expected: -1,
      },
      {
        args: [
          {
            A: [
              ["B", 5],
              ["A", 2],
            ],
            B: [
              ["D", 2],
              ["B", 0],
              ["C", 2],
              ["A", 0],
            ],
          },
          "C",
          "B",
        ],
        expected: -1,
      },
      {
        args: [
          {
            A: [
              ["B", 0],
              ["D", 4],
            ],
            B: [["B", 1]],
            C: [
              ["C", 2],
              ["A", 2],
              ["D", 4],
            ],
          },
          "B",
          "A",
        ],
        expected: -1,
      },
      {
        args: [
          {
            A: [
              ["A", 1],
              ["C", 5],
              ["B", 2],
              ["D", 4],
            ],
            B: [],
          },
          "A",
          "D",
        ],
        expected: 4,
      },
      {
        args: [
          {
            A: [
              ["A", 1],
              ["B", 3],
              ["C", 0],
            ],
            B: [
              ["A", 5],
              ["D", 1],
            ],
            C: [],
          },
          "B",
          "A",
        ],
        expected: 5,
      },
      {
        args: [
          {
            A: [
              ["A", 2],
              ["C", 2],
            ],
          },
          "B",
          "B",
        ],
        expected: 0,
      },
      {
        args: [
          {
            A: [["B", 0]],
          },
          "B",
          "B",
        ],
        expected: 0,
      },
      {
        args: [
          {
            A: [
              ["D", 3],
              ["B", 2],
            ],
            B: [
              ["B", 2],
              ["C", 2],
              ["A", 5],
              ["D", 1],
            ],
          },
          "A",
          "B",
        ],
        expected: 2,
      },
      {
        args: [
          {
            A: [],
          },
          "C",
          "A",
        ],
        expected: -1,
      },
      {
        args: [
          {
            A: [
              ["C", 5],
              ["A", 2],
              ["D", 3],
              ["B", 4],
            ],
            B: [
              ["B", 2],
              ["D", 2],
              ["C", 4],
            ],
            C: [],
            D: [
              ["D", 0],
              ["A", 3],
              ["B", 1],
            ],
          },
          "B",
          "C",
        ],
        expected: 4,
      },
    ],
    31: [
      {
        args: [3, []],
        expected: [0, 1, 2],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          3,
          [
            [2, 2],
            [0, 2],
            [0, 1],
            [1, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [0, 1],
            [1, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          [
            [1, 1],
            [0, 0],
            [0, 0],
            [1, 0],
            [0, 1],
          ],
        ],
        expected: [],
      },
      {
        args: [
          3,
          [
            [2, 1],
            [0, 2],
            [0, 0],
            [0, 0],
            [1, 1],
          ],
        ],
        expected: [],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          3,
          [
            [0, 1],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          4,
          [
            [0, 1],
            [1, 2],
            [2, 3],
          ],
        ],
        expected: [0, 1, 2, 3],
      },
      {
        args: [4, []],
        expected: [0, 1, 2, 3],
      },
    ],
    32: [
      {
        args: [
          4,
          [
            [0, 1, 2],
            [2, 3, 3],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [0, 3, -1],
            [2, 1, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          3,
          [
            [2, 1, 1],
            [0, 2, 5],
            [0, 2, 5],
            [0, 1, 1],
            [2, 2, -1],
            [1, 0, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [1, [[0, 0, 3]]],
        expected: 0,
      },
      {
        args: [
          1,
          [
            [0, 0, -3],
            [0, 0, 3],
            [0, 0, -3],
            [0, 0, -2],
          ],
        ],
        expected: 0,
      },
      {
        args: [1, [[0, 0, 2]]],
        expected: 0,
      },
      {
        args: [3, []],
        expected: -1,
      },
      {
        args: [2, []],
        expected: -1,
      },
      {
        args: [
          1,
          [
            [0, 0, 4],
            [0, 0, 5],
            [0, 0, -1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [2, 2, 2],
            [3, 3, 5],
            [2, 2, 0],
            [1, 2, 0],
            [0, 3, 5],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [2, 0, 0],
            [0, 2, 5],
            [0, 2, -2],
            [0, 0, 3],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [0, 3, 3],
            [3, 0, 4],
          ],
        ],
        expected: -1,
      },
    ],
    33: [
      {
        args: ["AaAaA", "Aaabb"],
        expected: 3,
      },
      {
        args: ["abba", "aab"],
        expected: 2,
      },
      {
        args: ["aa", "a"],
        expected: 1,
      },
      {
        args: ["AAbAA", "aAA"],
        expected: 2,
      },
      {
        args: ["aAAAb", ""],
        expected: 0,
      },
      {
        args: ["a", "AAaa"],
        expected: 1,
      },
      {
        args: ["bAab", "b"],
        expected: 1,
      },
      {
        args: ["", "bbaa"],
        expected: 0,
      },
      {
        args: ["bbaAa", "aAA"],
        expected: 2,
      },
      {
        args: ["abbA", "Abb"],
        expected: 2,
      },
      {
        args: ["aAb", "bAaAb"],
        expected: 3,
      },
      {
        args: ["aA", "Aaa"],
        expected: 1,
      },
    ],
    34: [
      {
        args: [[-3, -3]],
        expected: 1,
      },
      {
        args: [[3]],
        expected: 1,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[0]],
        expected: 1,
      },
      {
        args: [[2, 3, -1, -3, -1, 2]],
        expected: 3,
      },
      {
        args: [[1, 0, 0, -2, 3, -2]],
        expected: 2,
      },
      {
        args: [[-3, -1, 0]],
        expected: 3,
      },
      {
        args: [[2, 2, -2, 3, -1]],
        expected: 2,
      },
      {
        args: [[-2]],
        expected: 1,
      },
      {
        args: [[2]],
        expected: 1,
      },
      {
        args: [[-2, -1, -3, -2, -2]],
        expected: 2,
      },
      {
        args: [[1, -2, -1, 1]],
        expected: 3,
      },
    ],
    35: [
      {
        args: [[4], [0], 8],
        expected: 0,
      },
      {
        args: [[2, 7, 5, 4, 5, 2], [2, 3, 1, 0, 1, 2], 7],
        expected: 4,
      },
      {
        args: [[7, 2, 6], [3, 2, 2], 3],
        expected: 2,
      },
      {
        args: [[4, 6, 5, 7, 6], [0, 2, 1, 3, 2], 4],
        expected: 0,
      },
      {
        args: [[6, 3, 4, 7, 6, 4], [2, 1, 0, 3, 2, 0], 6],
        expected: 2,
      },
      {
        args: [[], [], 0],
        expected: 0,
      },
      {
        args: [[7, 6, 5, 4, 6], [3, 2, 1, 0, 2], 0],
        expected: 0,
      },
      {
        args: [[4, 1, 3, 6], [0, 3, 1, 2], 2],
        expected: 3,
      },
      {
        args: [[5, 7, 4, 3, 1], [1, 3, 0, 1, 3], 3],
        expected: 3,
      },
      {
        args: [[4, 6], [0, 2], 4],
        expected: 0,
      },
      {
        args: [[7, 3, 6], [3, 1, 2], 6],
        expected: 2,
      },
      {
        args: [[], [], 8],
        expected: 0,
      },
    ],
    36: [
      {
        args: [[2, -2, 1, 0, 0, 1], 4],
        expected: [2, -2, 1, 0, 0, 1, 4],
      },
      {
        args: [[-3, 2, 2, 0], 1],
        expected: [-3, 2, 2, 0, 1],
      },
      {
        args: [[], -1],
        expected: [-1],
      },
      {
        args: [[3, 3, -1], 0],
        expected: [3, 3, -1, 0],
      },
      {
        args: [[-3, 3, 0, -2], 4],
        expected: [-3, 3, 0, -2, 4],
      },
      {
        args: [[1, -2, 3], 0],
        expected: [1, -2, 3, 0],
      },
      {
        args: [[0], 2],
        expected: [0, 2],
      },
      {
        args: [[-3, -2, 1], 3],
        expected: [-3, -2, 1, 3],
      },
      {
        args: [[3], 3],
        expected: [3, 3],
      },
      {
        args: [[-2, 3, 2, 1, -2, 2], 4],
        expected: [-2, 3, 2, 1, -2, 2, 4],
      },
      {
        args: [[0, -2, -1, -1, -1, 1], 3],
        expected: [0, -2, -1, -1, -1, 1, 3],
      },
      {
        args: [[1, 3], 2],
        expected: [1, 3, 2],
      },
    ],
    37: [
      {
        args: [[0, 3]],
        expected: 2,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[3, 1, 3, 3, 3]],
        expected: 2,
      },
      {
        args: [[1, -2, 2]],
        expected: 3,
      },
      {
        args: [[-1]],
        expected: 1,
      },
      {
        args: [[0]],
        expected: 1,
      },
      {
        args: [[-3, 2, -2, 2, -2, -3]],
        expected: 3,
      },
      {
        args: [[-2, -3, -1, 0, 2]],
        expected: 5,
      },
      {
        args: [[0, 1, 1, 2, 0, 2]],
        expected: 3,
      },
      {
        args: [[-3, -3, -1, -3, -2, 3]],
        expected: 4,
      },
      {
        args: [[0, -3, 0, -3]],
        expected: 2,
      },
      {
        args: [[-1, -1, 3, -1, 3]],
        expected: 2,
      },
    ],
    38: [
      {
        args: [31],
        expected: 4,
      },
      {
        args: [32],
        expected: 5,
      },
      {
        args: [33],
        expected: 5,
      },
      {
        args: [228],
        expected: 7,
      },
      {
        args: [206],
        expected: 7,
      },
      {
        args: [180],
        expected: 7,
      },
      {
        args: [111],
        expected: 6,
      },
      {
        args: [11],
        expected: 3,
      },
      {
        args: [26],
        expected: 4,
      },
      {
        args: [151],
        expected: 7,
      },
      {
        args: [110],
        expected: 6,
      },
      {
        args: [3],
        expected: 1,
      },
    ],
    39: [
      {
        args: [[[], [1, [], [2]], 3]],
        expected: 6,
      },
      {
        args: [[[3, -3], [[-1, -2, -1, -2], []], 4]],
        expected: -2,
      },
      {
        args: [[[2, 1], [[2, 0, 1, -1], []], 0]],
        expected: 5,
      },
      {
        args: [[[-2], [[], []], 3]],
        expected: 1,
      },
      {
        args: [[[3, -3], [[3, -1, 1], []], 1]],
        expected: 4,
      },
      {
        args: [[[0], [[], []], 2]],
        expected: 2,
      },
      {
        args: [[[-2], [[], []], -4]],
        expected: -6,
      },
      {
        args: [[[0, -1], [[0], []], 2]],
        expected: 1,
      },
      {
        args: [[[1, 3], [[-3], []], 1]],
        expected: 2,
      },
      {
        args: [[[2, -2], [[-3, -3, 0], []], 3]],
        expected: -3,
      },
      {
        args: [[[3, -3], [[-1, 3, 0, -2], []], 0]],
        expected: 0,
      },
      {
        args: [[[-1, 0], [[3, 2], []], 3]],
        expected: 7,
      },
    ],
    40: [
      {
        args: [
          3,
          [
            [0, 1],
            [0, 1],
            [1, 1],
          ],
        ],
        expected: [[1, 1], [1], []],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [[0, 0, 0, 0, 0, 0]],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 1],
            [1, 1],
          ],
        ],
        expected: [[], [0, 1, 1]],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [[0, 0, 0, 0]],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [[0, 0]],
      },
      {
        args: [1, [[0, 0]]],
        expected: [[0]],
      },
      {
        args: [
          3,
          [
            [2, 2],
            [0, 0],
          ],
        ],
        expected: [[0], [], [2]],
      },
      {
        args: [
          3,
          [
            [1, 2],
            [1, 2],
            [2, 2],
            [2, 1],
            [1, 2],
            [1, 2],
          ],
        ],
        expected: [[], [2, 2, 2, 2], [2, 1]],
      },
      {
        args: [
          3,
          [
            [0, 0],
            [2, 2],
          ],
        ],
        expected: [[0], [], [2]],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
        expected: [[0], [0, 0, 1]],
      },
      {
        args: [
          4,
          [
            [0, 3],
            [1, 1],
            [2, 0],
            [1, 1],
            [0, 3],
          ],
        ],
        expected: [[3, 3], [1, 1], [0], []],
      },
      {
        args: [
          3,
          [
            [2, 1],
            [2, 0],
            [2, 1],
          ],
        ],
        expected: [[], [], [1, 0, 1]],
      },
    ],
    41: [
      {
        args: [[-3, 0, 2, 0], 1],
        expected: [-3, 0, 2, 0, 1],
      },
      {
        args: [[], 2],
        expected: [2],
      },
      {
        args: [[-3, 1], -2],
        expected: [-3, 1, -2],
      },
      {
        args: [[0, 3, 1], 3],
        expected: [0, 3, 1, 3],
      },
      {
        args: [[3], 3],
        expected: [3, 3],
      },
      {
        args: [[-2, 3], 1],
        expected: [-2, 3, 1],
      },
      {
        args: [[-3, -1, -1], -4],
        expected: [-4, -3, -1, -1],
      },
      {
        args: [[-3, -1, 3, 0], 2],
        expected: [-3, -1, 3, 0, 2],
      },
      {
        args: [[-2, 0], 3],
        expected: [-2, 0, 3],
      },
      {
        args: [[-2, -2, -1, -1], 3],
        expected: [-2, -2, -1, -1, 3],
      },
      {
        args: [[-3, -3, 1, 1, 2], -2],
        expected: [-3, -3, -2, 1, 2, 1],
      },
      {
        args: [[-1, 0, 3, 3, 2], 4],
        expected: [-1, 0, 3, 3, 2, 4],
      },
    ],
    42: [
      {
        args: [[1, 1, 8], 8],
        expected: 1,
      },
      {
        args: [[1, 4], 11],
        expected: 0,
      },
      {
        args: [[1, 3], 3],
        expected: 1,
      },
      {
        args: [[1, 2, 3, 3, 2], 4],
        expected: 2,
      },
      {
        args: [[2, 4, 1], 2],
        expected: 1,
      },
      {
        args: [[2, 2, 2, 4], 2],
        expected: 1,
      },
      {
        args: [[], 1],
        expected: 0,
      },
      {
        args: [[2], 7],
        expected: 0,
      },
      {
        args: [[4, 2, 4], 8],
        expected: 3,
      },
      {
        args: [[2, 4, 3], 6],
        expected: 2,
      },
      {
        args: [[], 8],
        expected: 0,
      },
      {
        args: [[2, 3, 2], 6],
        expected: 3,
      },
    ],
    43: [
      {
        args: ["abba"],
        expected: 2,
      },
      {
        args: ["dvdf"],
        expected: 3,
      },
      {
        args: ["aA"],
        expected: 2,
      },
      {
        args: ["bAAA"],
        expected: 2,
      },
      {
        args: ["abAab"],
        expected: 3,
      },
      {
        args: ["aaAAbb"],
        expected: 2,
      },
      {
        args: ["bA"],
        expected: 2,
      },
      {
        args: ["aAAbAa"],
        expected: 3,
      },
      {
        args: ["aAbaa"],
        expected: 3,
      },
      {
        args: ["ab"],
        expected: 2,
      },
      {
        args: ["AA"],
        expected: 1,
      },
      {
        args: ["aaaA"],
        expected: 2,
      },
    ],
    44: [
      {
        args: [
          {
            value: 2,
            next: {
              value: 2,
              next: null,
            },
          },
        ],
        expected: {
          value: 2,
          next: {
            value: 2,
            next: null,
          },
        },
      },
      {
        args: [
          {
            value: 3,
            next: null,
          },
        ],
        expected: {
          value: 3,
          next: null,
        },
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: -2,
              next: {
                value: 3,
                next: null,
              },
            },
          },
        ],
        expected: {
          value: 3,
          next: {
            value: -2,
            next: {
              value: 1,
              next: null,
            },
          },
        },
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: 2,
              next: {
                value: 2,
                next: {
                  value: -3,
                  next: null,
                },
              },
            },
          },
        ],
        expected: {
          value: -3,
          next: {
            value: 2,
            next: {
              value: 2,
              next: {
                value: 1,
                next: null,
              },
            },
          },
        },
      },
      {
        args: [
          {
            value: -1,
            next: null,
          },
        ],
        expected: {
          value: -1,
          next: null,
        },
      },
      {
        args: [
          {
            value: 0,
            next: {
              value: -2,
              next: {
                value: 3,
                next: {
                  value: -3,
                  next: null,
                },
              },
            },
          },
        ],
        expected: {
          value: -3,
          next: {
            value: 3,
            next: {
              value: -2,
              next: {
                value: 0,
                next: null,
              },
            },
          },
        },
      },
      {
        args: [
          {
            value: 3,
            next: {
              value: -1,
              next: {
                value: 0,
                next: {
                  value: -2,
                  next: {
                    value: 2,
                    next: null,
                  },
                },
              },
            },
          },
        ],
        expected: {
          value: 2,
          next: {
            value: -2,
            next: {
              value: 0,
              next: {
                value: -1,
                next: {
                  value: 3,
                  next: null,
                },
              },
            },
          },
        },
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: -3,
              next: null,
            },
          },
        ],
        expected: {
          value: -3,
          next: {
            value: 1,
            next: null,
          },
        },
      },
      {
        args: [
          {
            value: 0,
            next: {
              value: -2,
              next: {
                value: -3,
                next: {
                  value: -2,
                  next: {
                    value: 3,
                    next: {
                      value: 1,
                      next: null,
                    },
                  },
                },
              },
            },
          },
        ],
        expected: {
          value: 1,
          next: {
            value: 3,
            next: {
              value: -2,
              next: {
                value: -3,
                next: {
                  value: -2,
                  next: {
                    value: 0,
                    next: null,
                  },
                },
              },
            },
          },
        },
      },
      {
        args: [
          {
            value: 2,
            next: {
              value: 1,
              next: {
                value: 3,
                next: {
                  value: 1,
                  next: {
                    value: -3,
                    next: null,
                  },
                },
              },
            },
          },
        ],
        expected: {
          value: -3,
          next: {
            value: 1,
            next: {
              value: 3,
              next: {
                value: 1,
                next: {
                  value: 2,
                  next: null,
                },
              },
            },
          },
        },
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: 3,
              next: {
                value: -1,
                next: null,
              },
            },
          },
        ],
        expected: {
          value: -1,
          next: {
            value: 3,
            next: {
              value: 1,
              next: null,
            },
          },
        },
      },
      {
        args: [
          {
            value: 0,
            next: {
              value: 3,
              next: {
                value: -1,
                next: {
                  value: 1,
                  next: {
                    value: 3,
                    next: {
                      value: -1,
                      next: null,
                    },
                  },
                },
              },
            },
          },
        ],
        expected: {
          value: -1,
          next: {
            value: 3,
            next: {
              value: 1,
              next: {
                value: -1,
                next: {
                  value: 3,
                  next: {
                    value: 0,
                    next: null,
                  },
                },
              },
            },
          },
        },
      },
    ],
    45: [
      {
        args: [[1, 2, 2, 2, 4], 2],
        expected: 1,
      },
      {
        args: [[1, 2], 3],
        expected: 2,
      },
      {
        args: [[0, 2, 3], 4],
        expected: 3,
      },
      {
        args: [[-1], 0],
        expected: 1,
      },
      {
        args: [[-3, 0], 3],
        expected: 2,
      },
      {
        args: [[-2, 1, 3], 0],
        expected: 1,
      },
      {
        args: [[0, 2], -4],
        expected: 0,
      },
      {
        args: [[-3, -2, -2, 0, 1, 2], -4],
        expected: 0,
      },
      {
        args: [[-3, -2, 3], 4],
        expected: 3,
      },
      {
        args: [[2], 4],
        expected: 1,
      },
      {
        args: [[], -1],
        expected: 0,
      },
      {
        args: [[-2, 0], -1],
        expected: 1,
      },
    ],
    46: [
      {
        args: [
          {
            value: 1,
            left: {
              value: -3,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
          3,
        ],
        expected: {
          value: 1,
          left: {
            value: -3,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: null,
          },
          right: {
            value: 3,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: 2,
              left: {
                value: 1,
                left: {
                  value: -4,
                  left: {
                    value: -6,
                    left: null,
                    right: null,
                  },
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: {
              value: 4,
              left: null,
              right: null,
            },
          },
          4,
        ],
        expected: {
          value: 3,
          left: {
            value: 2,
            left: {
              value: 1,
              left: {
                value: -4,
                left: {
                  value: -6,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: null,
          },
          right: {
            value: 4,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: -5,
            left: null,
            right: {
              value: 5,
              left: {
                value: 3,
                left: {
                  value: -4,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
          },
          4,
        ],
        expected: {
          value: -5,
          left: null,
          right: {
            value: 5,
            left: {
              value: 3,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: {
                value: 4,
                left: null,
                right: null,
              },
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
        },
      },
      {
        args: [
          {
            value: -7,
            left: null,
            right: {
              value: 7,
              left: {
                value: 4,
                left: {
                  value: 0,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
          },
          1,
        ],
        expected: {
          value: -7,
          left: null,
          right: {
            value: 7,
            left: {
              value: 4,
              left: {
                value: 0,
                left: null,
                right: {
                  value: 1,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: 2,
              left: null,
              right: null,
            },
            right: null,
          },
          -2,
        ],
        expected: {
          value: 3,
          left: {
            value: 2,
            left: {
              value: -2,
              left: null,
              right: null,
            },
            right: null,
          },
          right: null,
        },
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: -1,
              left: null,
              right: {
                value: 6,
                left: null,
                right: null,
              },
            },
          },
          1,
        ],
        expected: {
          value: -6,
          left: null,
          right: {
            value: -1,
            left: null,
            right: {
              value: 6,
              left: {
                value: 1,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        },
      },
      {
        args: [
          {
            value: 6,
            left: {
              value: -2,
              left: {
                value: -5,
                left: null,
                right: null,
              },
              right: {
                value: 3,
                left: {
                  value: -1,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: null,
          },
          0,
        ],
        expected: {
          value: 6,
          left: {
            value: -2,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: {
              value: 3,
              left: {
                value: -1,
                left: null,
                right: {
                  value: 0,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
          },
          right: null,
        },
      },
      {
        args: [
          {
            value: -7,
            left: null,
            right: {
              value: 2,
              left: {
                value: 0,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          0,
        ],
        expected: {
          value: -7,
          left: null,
          right: {
            value: 2,
            left: {
              value: 0,
              left: null,
              right: null,
            },
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -5,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: {
                value: 0,
                left: {
                  value: -1,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: null,
          },
          4,
        ],
        expected: {
          value: 3,
          left: {
            value: -5,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: 0,
              left: {
                value: -1,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          right: {
            value: 4,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: null,
          },
          -4,
        ],
        expected: {
          value: 4,
          left: {
            value: -5,
            left: null,
            right: {
              value: -4,
              left: null,
              right: null,
            },
          },
          right: null,
        },
      },
      {
        args: [null, -4],
        expected: {
          value: -4,
          left: null,
          right: null,
        },
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -1,
              left: {
                value: -2,
                left: {
                  value: -6,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: 1,
                left: {
                  value: 0,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: null,
          },
          -2,
        ],
        expected: {
          value: 3,
          left: {
            value: -1,
            left: {
              value: -2,
              left: {
                value: -6,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 1,
              left: {
                value: 0,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          right: null,
        },
      },
    ],
    47: [
      {
        args: [
          {
            value: 5,
            left: null,
            right: null,
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: 6,
            left: {
              value: 1,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
        ],
        expected: 3,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: -2,
              left: null,
              right: {
                value: -1,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: 3,
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -3,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: {
                value: -1,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: 3,
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -8,
              left: null,
              right: {
                value: 1,
                left: {
                  value: -7,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
        ],
        expected: 4,
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 2,
              left: {
                value: -7,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
        ],
        expected: 3,
      },
      {
        args: [
          {
            value: -4,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: {
              value: 6,
              left: {
                value: 0,
                left: {
                  value: -3,
                  left: null,
                  right: null,
                },
                right: {
                  value: 4,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
          },
        ],
        expected: 4,
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: -4,
              left: {
                value: -7,
                left: null,
                right: null,
              },
              right: {
                value: -3,
                left: null,
                right: null,
              },
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
        ],
        expected: 3,
      },
      {
        args: [
          {
            value: 0,
            left: null,
            right: null,
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -2,
              left: null,
              right: {
                value: 3,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: 3,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -3,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: 2,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -7,
              left: null,
              right: null,
            },
            right: {
              value: 6,
              left: null,
              right: null,
            },
          },
        ],
        expected: 2,
      },
    ],
    48: [
      {
        args: [35],
        expected: 14930352,
      },
      {
        args: [2],
        expected: 2,
      },
      {
        args: [10],
        expected: 89,
      },
      {
        args: [9],
        expected: 55,
      },
      {
        args: [5],
        expected: 8,
      },
      {
        args: [11],
        expected: 144,
      },
      {
        args: [12],
        expected: 233,
      },
      {
        args: [6],
        expected: 13,
      },
      {
        args: [14],
        expected: 610,
      },
      {
        args: [13],
        expected: 377,
      },
      {
        args: [7],
        expected: 21,
      },
      {
        args: [3],
        expected: 3,
      },
    ],
    49: [
      {
        args: [3, 0],
        expected: 0,
      },
      {
        args: [1, 5],
        expected: 1,
      },
      {
        args: [5, 1],
        expected: 1,
      },
      {
        args: [15, 15],
        expected: 40116600,
      },
      {
        args: [0, 4],
        expected: 0,
      },
      {
        args: [3, 2],
        expected: 3,
      },
      {
        args: [2, 0],
        expected: 0,
      },
      {
        args: [4, 3],
        expected: 10,
      },
      {
        args: [4, 0],
        expected: 0,
      },
      {
        args: [2, 2],
        expected: 2,
      },
      {
        args: [0, 0],
        expected: 0,
      },
      {
        args: [4, 4],
        expected: 20,
      },
    ],
    50: [
      {
        args: [[5, 7, 6], [1, 3, 2], 2],
        expected: 0,
      },
      {
        args: [[5, 6, 5, 4, 5, 6], [1, 2, 1, 0, 1, 2], 3],
        expected: 0,
      },
      {
        args: [[], [], 0],
        expected: 0,
      },
      {
        args: [[7, 7], [3, 3], 8],
        expected: 3,
      },
      {
        args: [[6, 2, 1, 6, 3], [2, 2, 3, 2, 1], 1],
        expected: 3,
      },
      {
        args: [[3, 2, 1, 1, 2], [1, 2, 3, 3, 2], 1],
        expected: 3,
      },
      {
        args: [[], [], 2],
        expected: 0,
      },
      {
        args: [[5, 5], [1, 1], 7],
        expected: 1,
      },
      {
        args: [[], [], 3],
        expected: 0,
      },
      {
        args: [[1], [3], 2],
        expected: 3,
      },
      {
        args: [[6], [2], 5],
        expected: 0,
      },
      {
        args: [[4], [0], 7],
        expected: 0,
      },
    ],
    51: [
      {
        args: [[2, 2, 3]],
        expected: [3, 3, null],
      },
      {
        args: [[3, 2, 1]],
        expected: [null, null, null],
      },
      {
        args: [[3, 3, 2, 1, 2]],
        expected: [null, null, null, 2, null],
      },
      {
        args: [[-2]],
        expected: [null],
      },
      {
        args: [[1, 2, 3, -2, 3, 1]],
        expected: [2, 3, null, 3, null, null],
      },
      {
        args: [[1]],
        expected: [null],
      },
      {
        args: [[-2, -1, 3]],
        expected: [-1, 3, null],
      },
      {
        args: [[2, -1]],
        expected: [null, null],
      },
      {
        args: [[-2, -2, -1, -2]],
        expected: [-1, -1, null, null],
      },
      {
        args: [[2, -2, 2, 1]],
        expected: [null, 2, null, null],
      },
      {
        args: [[0]],
        expected: [null],
      },
      {
        args: [[2, 1]],
        expected: [null, null],
      },
    ],
    52: [
      {
        args: [
          [
            [1, 2],
            [2, 3],
          ],
        ],
        expected: [[1, 3]],
      },
      {
        args: [
          [
            [-3, -1],
            [-2, 3],
            [1, 5],
          ],
        ],
        expected: [[-3, 5]],
      },
      {
        args: [
          [
            [2, 4],
            [-1, 2],
          ],
        ],
        expected: [[-1, 4]],
      },
      {
        args: [
          [
            [-3, 1],
            [-4, 3],
          ],
        ],
        expected: [[-4, 3]],
      },
      {
        args: [
          [
            [-4, 3],
            [1, 2],
            [0, 2],
            [3, 5],
          ],
        ],
        expected: [[-4, 5]],
      },
      {
        args: [
          [
            [-4, 5],
            [-3, -1],
            [-1, 2],
          ],
        ],
        expected: [[-4, 5]],
      },
      {
        args: [
          [
            [-1, 4],
            [1, 2],
            [2, 4],
            [-4, -2],
            [-3, 2],
          ],
        ],
        expected: [[-4, 4]],
      },
      {
        args: [
          [
            [-1, 5],
            [-2, 4],
            [-1, 2],
            [-4, -3],
          ],
        ],
        expected: [
          [-4, -3],
          [-2, 5],
        ],
      },
      {
        args: [
          [
            [-4, 0],
            [-2, 2],
          ],
        ],
        expected: [[-4, 2]],
      },
      {
        args: [[[0, 4]]],
        expected: [[0, 4]],
      },
      {
        args: [
          [
            [1, 3],
            [-2, 1],
            [0, 3],
            [-4, 2],
          ],
        ],
        expected: [[-4, 3]],
      },
      {
        args: [
          [
            [-1, 0],
            [2, 5],
            [-2, 5],
            [2, 5],
            [-4, 4],
          ],
        ],
        expected: [[-4, 5]],
      },
    ],
    53: [
      {
        args: [[0, -11, -10, 2, 2, 0, -10]],
        expected: -11,
      },
      {
        args: [[6, -11, -1, 6, 9, -5, -5, 9, -1]],
        expected: -11,
      },
      {
        args: [[4, -11, 7, 7, 4]],
        expected: -11,
      },
      {
        args: [[-11, 0, 0]],
        expected: -11,
      },
      {
        args: [[-11]],
        expected: -11,
      },
      {
        args: [[-1, 4, -11, 4, -7, -1, -7]],
        expected: -11,
      },
      {
        args: [[-8, -3, -11, -8, -3]],
        expected: -11,
      },
      {
        args: [[-3, -3, 4, -11, 4]],
        expected: -11,
      },
      {
        args: [[4, -11, 7, -2, 4, 7, -2]],
        expected: -11,
      },
      {
        args: [[-11, 5, 5]],
        expected: -11,
      },
      {
        args: [[2, -11, 2, -1, -2, -2, -1]],
        expected: -11,
      },
      {
        args: [[-10, -10, 1, 1, -11]],
        expected: -11,
      },
    ],
    54: [
      {
        args: [[1, 4, 1, -2], 3],
        expected: [[], [1, 4, -2], []],
      },
      {
        args: [[-2], 1],
        expected: [[-2]],
      },
      {
        args: [[-3, -1, -2], 1],
        expected: [[-3, -1, -2]],
      },
      {
        args: [[1, 0, -2, 0, -1, -2], 1],
        expected: [[1, 0, -2, -1]],
      },
      {
        args: [[3, 0, 0, 2, 1, 2], 1],
        expected: [[3, 0, 2, 1]],
      },
      {
        args: [[0, 0, -3, -2], 2],
        expected: [[0, -2], [-3]],
      },
      {
        args: [[0, 2, 3, -1, 3], 3],
        expected: [[0, 3], [], [2, -1]],
      },
      {
        args: [[], 4],
        expected: [[], [], [], []],
      },
      {
        args: [[1], 1],
        expected: [[1]],
      },
      {
        args: [[0], 4],
        expected: [[0], [], [], []],
      },
      {
        args: [[], 3],
        expected: [[], [], []],
      },
      {
        args: [[-2, 1], 4],
        expected: [[], [1], [-2], []],
      },
    ],
    55: [
      {
        args: [[null], 0],
        expected: false,
      },
      {
        args: [[2, 2, 0, 1], 2],
        expected: true,
      },
      {
        args: [[1, 2, null, 0], 3],
        expected: false,
      },
      {
        args: [[null, 2, 2], 0],
        expected: false,
      },
      {
        args: [[null, 2, 2], 2],
        expected: true,
      },
      {
        args: [[0, 1], 0],
        expected: true,
      },
      {
        args: [[1, 2, 0], 0],
        expected: true,
      },
      {
        args: [[null, 0], 0],
        expected: false,
      },
      {
        args: [[1, 2, 2], 2],
        expected: true,
      },
      {
        args: [[1, null], 1],
        expected: false,
      },
      {
        args: [[2, null, 3, 2], 3],
        expected: true,
      },
      {
        args: [[2, null, 0, null], 3],
        expected: false,
      },
    ],
    56: [
      {
        args: [
          3,
          [
            [1, 2, -1],
            [2, 1, -1],
          ],
          0,
        ],
        expected: [0, null, null],
      },
      {
        args: [
          4,
          [
            [1, 1, 1],
            [0, 1, 2],
            [1, 1, 3],
            [1, 1, -3],
          ],
          2,
        ],
        expected: [null, null, 0, null],
      },
      {
        args: [
          3,
          [
            [2, 2, -1],
            [2, 0, 5],
            [2, 2, -3],
            [0, 0, 4],
          ],
          1,
        ],
        expected: [null, 0, null],
      },
      {
        args: [1, [], 0],
        expected: [0],
      },
      {
        args: [
          1,
          [
            [0, 0, 1],
            [0, 0, 2],
            [0, 0, 1],
          ],
          0,
        ],
        expected: [0],
      },
      {
        args: [
          3,
          [
            [2, 0, 3],
            [1, 1, 4],
            [0, 0, -3],
            [2, 2, 0],
            [0, 0, -1],
            [0, 1, 4],
          ],
          1,
        ],
        expected: [null, 0, null],
      },
      {
        args: [
          1,
          [
            [0, 0, -3],
            [0, 0, 3],
            [0, 0, 3],
            [0, 0, 1],
            [0, 0, 5],
            [0, 0, 2],
          ],
          0,
        ],
        expected: [],
      },
      {
        args: [
          1,
          [
            [0, 0, 5],
            [0, 0, 3],
            [0, 0, 3],
            [0, 0, -3],
          ],
          0,
        ],
        expected: [],
      },
      {
        args: [2, [], 1],
        expected: [null, 0],
      },
      {
        args: [
          3,
          [
            [0, 0, -3],
            [0, 2, 4],
          ],
          0,
        ],
        expected: [],
      },
      {
        args: [3, [], 0],
        expected: [0, null, null],
      },
      {
        args: [
          3,
          [
            [0, 1, 4],
            [1, 0, -2],
            [0, 2, 0],
            [0, 0, 5],
            [0, 1, 5],
          ],
          0,
        ],
        expected: [0, 4, 0],
      },
    ],
    57: [
      {
        args: [
          [0, -2, -3],
          [
            ["prefix", 2],
            ["add", 0, 1],
            ["prefix", 3],
          ],
        ],
        expected: [-2, -4],
      },
      {
        args: [
          [3, -2],
          [
            ["prefix", 0],
            ["add", 0, 2],
            ["prefix", 2],
          ],
        ],
        expected: [0, 3],
      },
      {
        args: [
          [1, 0, 3, -1],
          [
            ["prefix", 1],
            ["add", 0, 2],
            ["prefix", 4],
          ],
        ],
        expected: [1, 5],
      },
      {
        args: [
          [-2],
          [
            ["prefix", 0],
            ["add", 0, 1],
            ["prefix", 1],
          ],
        ],
        expected: [0, -1],
      },
      {
        args: [
          [-3, -2, 1],
          [
            ["prefix", 0],
            ["add", 0, -1],
            ["prefix", 3],
          ],
        ],
        expected: [0, -5],
      },
      {
        args: [
          [2, -2, 0, 2],
          [
            ["prefix", 0],
            ["add", 0, 3],
            ["prefix", 4],
          ],
        ],
        expected: [0, 5],
      },
      {
        args: [
          [-2, -1, 3],
          [
            ["prefix", 2],
            ["add", 0, -3],
            ["prefix", 3],
          ],
        ],
        expected: [-3, -3],
      },
      {
        args: [
          [-2, -1, 1, -2, 1, 2],
          [
            ["prefix", 5],
            ["add", 0, 2],
            ["prefix", 6],
          ],
        ],
        expected: [-3, 1],
      },
      {
        args: [
          [0, 2],
          [
            ["prefix", 2],
            ["add", 0, 1],
            ["prefix", 2],
          ],
        ],
        expected: [2, 3],
      },
      {
        args: [
          [-2, -1, 1, -3, -2, 2],
          [
            ["prefix", 3],
            ["add", 0, 1],
            ["prefix", 6],
          ],
        ],
        expected: [-2, -4],
      },
      {
        args: [
          [3, 2, 3, -1],
          [
            ["prefix", 4],
            ["add", 0, 0],
            ["prefix", 4],
          ],
        ],
        expected: [7, 7],
      },
      {
        args: [
          [-2, -1],
          [
            ["prefix", 0],
            ["add", 0, 3],
            ["prefix", 2],
          ],
        ],
        expected: [0, 0],
      },
    ],
    58: [
      {
        args: ["aaaa", "aa"],
        expected: 0,
      },
      {
        args: ["AbabaA", ""],
        expected: 0,
      },
      {
        args: ["a", "aba"],
        expected: -1,
      },
      {
        args: ["AaA", "aba"],
        expected: -1,
      },
      {
        args: ["Abb", "aa"],
        expected: -1,
      },
      {
        args: ["AaAAb", ""],
        expected: 0,
      },
      {
        args: ["AAAaA", "aba"],
        expected: -1,
      },
      {
        args: ["Aaaab", "aa"],
        expected: 1,
      },
      {
        args: ["bAa", "aa"],
        expected: -1,
      },
      {
        args: ["bbbAA", "aba"],
        expected: -1,
      },
      {
        args: ["baba", "aba"],
        expected: 1,
      },
      {
        args: ["aA", "aa"],
        expected: -1,
      },
    ],
    59: [
      {
        args: [-18, 12],
        expected: 6,
      },
      {
        args: [-1, 4],
        expected: 1,
      },
      {
        args: [1, -6],
        expected: 1,
      },
      {
        args: [3, 10],
        expected: 1,
      },
      {
        args: [-1, -6],
        expected: 1,
      },
      {
        args: [0, 11],
        expected: 11,
      },
      {
        args: [4, 12],
        expected: 4,
      },
      {
        args: [2, 13],
        expected: 1,
      },
      {
        args: [-1, -17],
        expected: 1,
      },
      {
        args: [-4, -19],
        expected: 1,
      },
      {
        args: [-4, 17],
        expected: 1,
      },
      {
        args: [-2, 5],
        expected: 1,
      },
    ],
    60: [
      {
        args: [[2, -2]],
        expected: 2,
      },
      {
        args: [[4, -2, 5, 2, 5, 0, -1]],
        expected: 14,
      },
      {
        args: [[1, 3, -3, -3, 2]],
        expected: 4,
      },
      {
        args: [[-2, -2, 4, 1, -5, 4, -4]],
        expected: 5,
      },
      {
        args: [[-3, 5, 4, -4, 1]],
        expected: 9,
      },
      {
        args: [[2, 2, -5, 2, -5]],
        expected: 4,
      },
      {
        args: [[1, 0, -4, -1, 0]],
        expected: 1,
      },
      {
        args: [[-1]],
        expected: -1,
      },
      {
        args: [[0, 5, -1, -2, -2, 5, 1]],
        expected: 6,
      },
      {
        args: [[4]],
        expected: 4,
      },
      {
        args: [[-1, 3, 0, 5, -5]],
        expected: 8,
      },
      {
        args: [[-4, -3]],
        expected: -3,
      },
    ],
    61: [
      {
        args: [[4, 1], -1],
        expected: 0,
      },
      {
        args: [[3], -1],
        expected: 0,
      },
      {
        args: [[1, -2], 4],
        expected: 0,
      },
      {
        args: [[-4, -3, -2], -1],
        expected: 0,
      },
      {
        args: [[-2, -5, -1, 1, 1, 1, -5], 1],
        expected: 4,
      },
      {
        args: [[-2, -5, -1, -1, 1, -2], -3],
        expected: 1,
      },
      {
        args: [[-5, 1, 3, -3, -4, -2, 2], 3],
        expected: 1,
      },
      {
        args: [[4, 2, 2, 5], 0],
        expected: 0,
      },
      {
        args: [[-5], 0],
        expected: 0,
      },
      {
        args: [[4, 4, 4, 4, 2, -1], 3],
        expected: 0,
      },
      {
        args: [[5, 5, -4, 3, 2, -4, -4], -1],
        expected: 1,
      },
      {
        args: [[-5, 5], -4],
        expected: 0,
      },
    ],
    62: [
      {
        args: [[5, 4, 5, 6, 3], 9],
        expected: 3,
      },
      {
        args: [[], 4],
        expected: 0,
      },
      {
        args: [[2, 3, 2, 3], 10],
        expected: 1,
      },
      {
        args: [[4, 3, 6, 3, 4], 7],
        expected: 4,
      },
      {
        args: [[3], 6],
        expected: 1,
      },
      {
        args: [[4, 4], 8],
        expected: 1,
      },
      {
        args: [[6, 3, 5], 5],
        expected: 3,
      },
      {
        args: [[4], 3],
        expected: 2,
      },
      {
        args: [[6, 3], 2],
        expected: 6,
      },
      {
        args: [[3, 4], 6],
        expected: 2,
      },
      {
        args: [[], 7],
        expected: 0,
      },
      {
        args: [[2, 4, 5, 2], 10],
        expected: 2,
      },
    ],
    63: [
      {
        args: [
          4,
          [
            [1, 0],
            [0, 0],
            [2, 0],
          ],
        ],
        expected: false,
      },
      {
        args: [
          3,
          [
            [2, 0],
            [2, 0],
            [2, 0],
          ],
        ],
        expected: true,
      },
      {
        args: [
          5,
          [
            [1, 2],
            [1, 2],
            [4, 1],
            [2, 3],
          ],
        ],
        expected: true,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: false,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [0, 2],
            [1, 1],
            [2, 1],
          ],
        ],
        expected: false,
      },
      {
        args: [
          4,
          [
            [3, 1],
            [2, 2],
          ],
        ],
        expected: false,
      },
      {
        args: [
          2,
          [
            [0, 0],
            [1, 0],
            [1, 0],
            [1, 1],
            [1, 1],
          ],
        ],
        expected: false,
      },
      {
        args: [5, [[1, 3]]],
        expected: true,
      },
      {
        args: [
          4,
          [
            [3, 3],
            [1, 2],
            [3, 3],
            [1, 0],
            [3, 1],
            [3, 0],
            [0, 3],
            [2, 2],
          ],
        ],
        expected: false,
      },
      {
        args: [
          3,
          [
            [0, 0],
            [1, 2],
            [1, 1],
            [1, 2],
            [0, 0],
          ],
        ],
        expected: false,
      },
      {
        args: [
          5,
          [
            [0, 0],
            [0, 3],
            [3, 2],
            [1, 4],
            [4, 1],
          ],
        ],
        expected: false,
      },
      {
        args: [
          5,
          [
            [1, 1],
            [3, 0],
            [4, 2],
            [3, 2],
            [3, 2],
            [2, 3],
            [3, 0],
            [3, 0],
          ],
        ],
        expected: false,
      },
    ],
    64: [
      {
        args: [[[], [], [], []]],
        expected: [[], [], [], []],
      },
      {
        args: [[[0], [0]]],
        expected: [[0], [0]],
      },
      {
        args: [[[1], [0], [0], [1]]],
        expected: [[1], [0], [0], [1]],
      },
      {
        args: [[[1], [0], [0], [0]]],
        expected: [[1], [0], [0], [0]],
      },
      {
        args: [
          [
            [0, 1, 1],
            [1, 0, 0],
            [1, 1, 1],
          ],
        ],
        expected: [
          [0, 1, 1],
          [1, 0, 0],
          [2, 1, 1],
        ],
      },
      {
        args: [
          [
            [1, 1],
            [0, 0],
            [1, 0],
            [0, 0],
          ],
        ],
        expected: [
          [1, 1],
          [0, 0],
          [1, 0],
          [0, 0],
        ],
      },
      {
        args: [
          [
            [0, 1, 0],
            [0, 1, 1],
            [1, 0, 1],
            [1, 0, 1],
          ],
        ],
        expected: [
          [0, 1, 0],
          [0, 1, 1],
          [1, 0, 1],
          [1, 0, 1],
        ],
      },
      {
        args: [[[0, 0]]],
        expected: [[0, 0]],
      },
      {
        args: [[[], []]],
        expected: [[], []],
      },
      {
        args: [[[1]]],
        expected: [[-1]],
      },
      {
        args: [
          [
            [0, 0],
            [1, 0],
            [0, 1],
          ],
        ],
        expected: [
          [0, 0],
          [1, 0],
          [0, 1],
        ],
      },
      {
        args: [[[0, 0, 1]]],
        expected: [[0, 0, 1]],
      },
    ],
    65: [
      {
        args: ["0Aé00", "a"],
        expected: 5,
      },
      {
        args: ["", "ébéB"],
        expected: 4,
      },
      {
        args: ["!é1!", ""],
        expected: 4,
      },
      {
        args: ["0béB!é", ""],
        expected: 6,
      },
      {
        args: ["ABé!bBb", "a1A0A"],
        expected: 7,
      },
      {
        args: ["1B", "a"],
        expected: 2,
      },
      {
        args: ["0!1aAa", "1BaaB"],
        expected: 5,
      },
      {
        args: ["!b!", "b0a1"],
        expected: 4,
      },
      {
        args: ["B00éé!", "BBaABb"],
        expected: 5,
      },
      {
        args: ["a", "éébb0B"],
        expected: 6,
      },
      {
        args: ["0aa100", "Bé1!"],
        expected: 5,
      },
      {
        args: ["BA", "é1"],
        expected: 2,
      },
    ],
    66: [
      {
        args: [[-2, 0, -5, -5, -1, -1], -3],
        expected: [
          [-5, -5],
          [-2, 0, -1, -1],
        ],
      },
      {
        args: [[-1, 0, 1, 4, 4, 1], 4],
        expected: [
          [-1, 0, 1, 1],
          [4, 4],
        ],
      },
      {
        args: [[-3, -3, -4], -2],
        expected: [[-3, -3, -4], []],
      },
      {
        args: [[3, 4, -2, 2], 0],
        expected: [[-2], [3, 4, 2]],
      },
      {
        args: [[5, -2, -1], -4],
        expected: [[], [5, -2, -1]],
      },
      {
        args: [[0, -5, 5], 0],
        expected: [[-5], [0, 5]],
      },
      {
        args: [[4], -1],
        expected: [[], [4]],
      },
      {
        args: [[-5, -3], 0],
        expected: [[-5, -3], []],
      },
      {
        args: [[3, 4, -3, -2, -3, 3, 3], -1],
        expected: [
          [-3, -2, -3],
          [3, 4, 3, 3],
        ],
      },
      {
        args: [[], -3],
        expected: [[], []],
      },
      {
        args: [[-5, -5], 0],
        expected: [[-5, -5], []],
      },
      {
        args: [[-2, 4, -2, -3], 1],
        expected: [[-2, -2, -3], [4]],
      },
    ],
    67: [
      {
        args: [27],
        expected: 378,
      },
      {
        args: [18],
        expected: 171,
      },
      {
        args: [17],
        expected: 153,
      },
      {
        args: [26],
        expected: 351,
      },
      {
        args: [6],
        expected: 21,
      },
      {
        args: [15],
        expected: 120,
      },
      {
        args: [3],
        expected: 6,
      },
      {
        args: [12],
        expected: 78,
      },
      {
        args: [5],
        expected: 15,
      },
      {
        args: [16],
        expected: 136,
      },
      {
        args: [28],
        expected: 406,
      },
      {
        args: [7],
        expected: 28,
      },
    ],
    68: [
      {
        args: [2],
        expected: 4,
      },
      {
        args: [16],
        expected: 80,
      },
      {
        args: [32],
        expected: 192,
      },
      {
        args: [64],
        expected: 448,
      },
      {
        args: [128],
        expected: 1024,
      },
      {
        args: [256],
        expected: 2304,
      },
      {
        args: [512],
        expected: 5120,
      },
      {
        args: [1024],
        expected: 11264,
      },
    ],
    69: [
      {
        args: [41],
        expected: [104, 64],
      },
      {
        args: [10],
        expected: [25, 16],
      },
      {
        args: [42],
        expected: [105, 64],
      },
      {
        args: [8],
        expected: [15, 8],
      },
      {
        args: [24],
        expected: [55, 32],
      },
      {
        args: [29],
        expected: [60, 32],
      },
      {
        args: [9],
        expected: [24, 16],
      },
      {
        args: [11],
        expected: [26, 16],
      },
      {
        args: [69],
        expected: [196, 128],
      },
      {
        args: [30],
        expected: [61, 32],
      },
      {
        args: [37],
        expected: [100, 64],
      },
      {
        args: [58],
        expected: [121, 64],
      },
    ],
    70: [
      {
        args: [1],
        expected: 0,
      },
      {
        args: [2],
        expected: 1,
      },
      {
        args: [5],
        expected: 7,
      },
      {
        args: [6],
        expected: 10,
      },
      {
        args: [7],
        expected: 13,
      },
      {
        args: [8],
        expected: 16,
      },
      {
        args: [9],
        expected: 19,
      },
      {
        args: [10],
        expected: 22,
      },
      {
        args: [11],
        expected: 26,
      },
      {
        args: [12],
        expected: 29,
      },
    ],
    71: [
      {
        args: [[33, 47, 16, 49, 26, 13]],
        expected: [13, 16, 26, 33, 47, 49],
      },
      {
        args: [[11, 40, 25]],
        expected: [11, 25, 40],
      },
      {
        args: [[44, 22, 9, 30, 40, 38, 5]],
        expected: [5, 9, 22, 30, 38, 40, 44],
      },
      {
        args: [[30]],
        expected: [30],
      },
      {
        args: [[49, 46, 28, 19, 9]],
        expected: [9, 19, 28, 46, 49],
      },
      {
        args: [[10, 24, 4, 44, 0, 42]],
        expected: [0, 4, 10, 24, 42, 44],
      },
      {
        args: [[5, 49, 49, 17, 29]],
        expected: [5, 17, 29, 49, 49],
      },
      {
        args: [[25, 46, 9, 15, 32]],
        expected: [9, 15, 25, 32, 46],
      },
      {
        args: [[49, 2, 18]],
        expected: [2, 18, 49],
      },
      {
        args: [[9, 41, 35, 48]],
        expected: [9, 35, 41, 48],
      },
      {
        args: [[25, 23, 35]],
        expected: [23, 25, 35],
      },
      {
        args: [[41, 30, 10, 45]],
        expected: [10, 30, 41, 45],
      },
    ],
    72: [
      {
        args: [[7541]],
        expected: [7541],
      },
      {
        args: [[1924, 4035, 3070, 9482, 8125, 7953, 9562]],
        expected: [1924, 3070, 4035, 7953, 8125, 9482, 9562],
      },
      {
        args: [[588, 4994]],
        expected: [588, 4994],
      },
      {
        args: [[1021]],
        expected: [1021],
      },
      {
        args: [[4000, 3082]],
        expected: [3082, 4000],
      },
      {
        args: [[451, 4191]],
        expected: [451, 4191],
      },
      {
        args: [[155, 2352]],
        expected: [155, 2352],
      },
      {
        args: [[6851, 3748]],
        expected: [3748, 6851],
      },
      {
        args: [[5861, 3144]],
        expected: [3144, 5861],
      },
      {
        args: [[9281, 3997, 8968, 280, 2257, 7137]],
        expected: [280, 2257, 3997, 7137, 8968, 9281],
      },
      {
        args: [[6581, 7690, 9415, 2245, 7558, 1066]],
        expected: [1066, 2245, 6581, 7558, 7690, 9415],
      },
      {
        args: [[9362, 8602, 6937, 5233, 902]],
        expected: [902, 5233, 6937, 8602, 9362],
      },
    ],
    73: [
      {
        args: [[4], 0],
        expected: 4,
      },
      {
        args: [[1, 5], 1],
        expected: 5,
      },
      {
        args: [[1, -4, -3, -3], 1],
        expected: -3,
      },
      {
        args: [[0, 3, 1], 1],
        expected: 1,
      },
      {
        args: [[3, 5], 1],
        expected: 5,
      },
      {
        args: [[-4, 5], 0],
        expected: -4,
      },
      {
        args: [[1, -4, 1, 0, -5, 5], 0],
        expected: -5,
      },
      {
        args: [[5], 0],
        expected: 5,
      },
      {
        args: [[0, -3, 3, 3, -3, 2], 3],
        expected: 2,
      },
      {
        args: [[3, 5, -2, -3, 3, 1, -4], 3],
        expected: 1,
      },
      {
        args: [[-2, 3, -5], 0],
        expected: -5,
      },
      {
        args: [[-2], 0],
        expected: -2,
      },
    ],
    74: [
      {
        args: [
          [
            [3, "id0"],
            [0, "id1"],
            [0, "id2"],
            [1, "id3"],
            [2, "id4"],
            [2, "id5"],
          ],
        ],
        expected: [
          [0, "id1"],
          [0, "id2"],
          [1, "id3"],
          [2, "id4"],
          [2, "id5"],
          [3, "id0"],
        ],
      },
      {
        args: [
          [
            [0, "id0"],
            [2, "id1"],
            [2, "id2"],
            [3, "id3"],
            [1, "id4"],
            [2, "id5"],
            [0, "id6"],
          ],
        ],
        expected: [
          [0, "id0"],
          [0, "id6"],
          [1, "id4"],
          [2, "id1"],
          [2, "id2"],
          [2, "id5"],
          [3, "id3"],
        ],
      },
      {
        args: [
          [
            [3, "id0"],
            [3, "id1"],
          ],
        ],
        expected: [
          [3, "id0"],
          [3, "id1"],
        ],
      },
      {
        args: [[[2, "id0"]]],
        expected: [[2, "id0"]],
      },
      {
        args: [
          [
            [3, "id0"],
            [1, "id1"],
            [2, "id2"],
          ],
        ],
        expected: [
          [1, "id1"],
          [2, "id2"],
          [3, "id0"],
        ],
      },
      {
        args: [
          [
            [2, "id0"],
            [3, "id1"],
            [2, "id2"],
            [1, "id3"],
          ],
        ],
        expected: [
          [1, "id3"],
          [2, "id0"],
          [2, "id2"],
          [3, "id1"],
        ],
      },
      {
        args: [[[3, "id0"]]],
        expected: [[3, "id0"]],
      },
      {
        args: [
          [
            [0, "id0"],
            [2, "id1"],
            [0, "id2"],
            [2, "id3"],
            [1, "id4"],
            [1, "id5"],
            [3, "id6"],
          ],
        ],
        expected: [
          [0, "id0"],
          [0, "id2"],
          [1, "id4"],
          [1, "id5"],
          [2, "id1"],
          [2, "id3"],
          [3, "id6"],
        ],
      },
      {
        args: [
          [
            [3, "id0"],
            [2, "id1"],
            [0, "id2"],
            [0, "id3"],
            [1, "id4"],
          ],
        ],
        expected: [
          [0, "id2"],
          [0, "id3"],
          [1, "id4"],
          [2, "id1"],
          [3, "id0"],
        ],
      },
      {
        args: [
          [
            [0, "id0"],
            [2, "id1"],
            [0, "id2"],
            [2, "id3"],
            [1, "id4"],
          ],
        ],
        expected: [
          [0, "id0"],
          [0, "id2"],
          [1, "id4"],
          [2, "id1"],
          [2, "id3"],
        ],
      },
      {
        args: [
          [
            [1, "id0"],
            [1, "id1"],
            [1, "id2"],
            [1, "id3"],
            [2, "id4"],
          ],
        ],
        expected: [
          [1, "id0"],
          [1, "id1"],
          [1, "id2"],
          [1, "id3"],
          [2, "id4"],
        ],
      },
      {
        args: [
          [
            [2, "id0"],
            [1, "id1"],
            [2, "id2"],
          ],
        ],
        expected: [
          [1, "id1"],
          [2, "id0"],
          [2, "id2"],
        ],
      },
    ],
    75: [
      {
        args: [
          {
            value: -5,
            left: {
              value: -6,
              left: null,
              right: null,
            },
            right: {
              value: -2,
              left: null,
              right: null,
            },
          },
          8,
        ],
        expected: {
          value: -5,
          left: {
            value: -6,
            left: null,
            right: null,
          },
          right: {
            value: -2,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [null, 6],
        expected: null,
      },
      {
        args: [
          {
            value: 6,
            left: {
              value: -4,
              left: {
                value: -6,
                left: {
                  value: -8,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: -1,
                left: null,
                right: {
                  value: 2,
                  left: null,
                  right: null,
                },
              },
            },
            right: null,
          },
          8,
        ],
        expected: {
          value: 6,
          left: {
            value: -4,
            left: {
              value: -6,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: -1,
              left: null,
              right: {
                value: 2,
                left: null,
                right: null,
              },
            },
          },
          right: null,
        },
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: {
              value: 0,
              left: null,
              right: {
                value: 3,
                left: null,
                right: null,
              },
            },
          },
          -9,
        ],
        expected: {
          value: -3,
          left: {
            value: -5,
            left: null,
            right: null,
          },
          right: {
            value: 0,
            left: null,
            right: {
              value: 3,
              left: null,
              right: null,
            },
          },
        },
      },
      {
        args: [null, -6],
        expected: null,
      },
      {
        args: [
          {
            value: 7,
            left: {
              value: 0,
              left: {
                value: -1,
                left: null,
                right: null,
              },
              right: {
                value: 2,
                left: {
                  value: 1,
                  left: null,
                  right: null,
                },
                right: {
                  value: 4,
                  left: null,
                  right: null,
                },
              },
            },
            right: null,
          },
          6,
        ],
        expected: {
          value: 7,
          left: {
            value: 0,
            left: {
              value: -1,
              left: null,
              right: null,
            },
            right: {
              value: 2,
              left: {
                value: 1,
                left: null,
                right: null,
              },
              right: {
                value: 4,
                left: null,
                right: null,
              },
            },
          },
          right: null,
        },
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: -3,
              left: null,
              right: {
                value: 1,
                left: {
                  value: -1,
                  left: null,
                  right: {
                    value: 0,
                    left: null,
                    right: null,
                  },
                },
                right: {
                  value: 3,
                  left: null,
                  right: null,
                },
              },
            },
          },
          8,
        ],
        expected: {
          value: -6,
          left: null,
          right: {
            value: -3,
            left: null,
            right: {
              value: 1,
              left: {
                value: -1,
                left: null,
                right: {
                  value: 0,
                  left: null,
                  right: null,
                },
              },
              right: {
                value: 3,
                left: null,
                right: null,
              },
            },
          },
        },
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -7,
              left: null,
              right: null,
            },
            right: null,
          },
          6,
        ],
        expected: {
          value: 8,
          left: {
            value: -7,
            left: null,
            right: null,
          },
          right: null,
        },
      },
      {
        args: [
          {
            value: 6,
            left: {
              value: 3,
              left: {
                value: -8,
                left: null,
                right: {
                  value: -3,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: {
              value: 7,
              left: null,
              right: {
                value: 8,
                left: null,
                right: null,
              },
            },
          },
          -8,
        ],
        expected: {
          value: 6,
          left: {
            value: 3,
            left: {
              value: -3,
              left: null,
              right: null,
            },
            right: null,
          },
          right: {
            value: 7,
            left: null,
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        },
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: 1,
              left: {
                value: -7,
                left: null,
                right: {
                  value: -4,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: null,
          },
          -7,
        ],
        expected: {
          value: 2,
          left: {
            value: 1,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: null,
          },
          right: null,
        },
      },
      {
        args: [null, 4],
        expected: null,
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: -3,
              left: null,
              right: {
                value: 4,
                left: null,
                right: null,
              },
            },
          },
          4,
        ],
        expected: {
          value: -8,
          left: null,
          right: {
            value: -3,
            left: null,
            right: null,
          },
        },
      },
    ],
    76: [
      {
        args: [[-1, 0]],
        expected: {
          value: -1,
          left: null,
          right: {
            value: 0,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [[5, 3, -2, 3, 1, 0, -4]],
        expected: {
          value: 0,
          left: {
            value: -2,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: null,
          },
          right: {
            value: 3,
            left: {
              value: 1,
              left: null,
              right: null,
            },
            right: {
              value: 5,
              left: null,
              right: null,
            },
          },
        },
      },
      {
        args: [[-1, 0, -5, -3, 1, -3, -5]],
        expected: {
          value: -1,
          left: {
            value: -5,
            left: null,
            right: {
              value: -3,
              left: null,
              right: null,
            },
          },
          right: {
            value: 0,
            left: null,
            right: {
              value: 1,
              left: null,
              right: null,
            },
          },
        },
      },
      {
        args: [[-1, -2, 0]],
        expected: {
          value: -1,
          left: {
            value: -2,
            left: null,
            right: null,
          },
          right: {
            value: 0,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [[0, 3, 3, -3]],
        expected: {
          value: 0,
          left: {
            value: -3,
            left: null,
            right: null,
          },
          right: {
            value: 3,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [[-3, 2]],
        expected: {
          value: -3,
          left: null,
          right: {
            value: 2,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [[0, 2]],
        expected: {
          value: 0,
          left: null,
          right: {
            value: 2,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [[5, 2]],
        expected: {
          value: 5,
          left: {
            value: 2,
            left: null,
            right: null,
          },
          right: null,
        },
      },
      {
        args: [[-5, -2, 5, -3, -4, 0]],
        expected: {
          value: -2,
          left: {
            value: -4,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: {
              value: -3,
              left: null,
              right: null,
            },
          },
          right: {
            value: 5,
            left: {
              value: 0,
              left: null,
              right: null,
            },
            right: null,
          },
        },
      },
      {
        args: [[-2, -5, -3, 3, -5, 3]],
        expected: {
          value: -3,
          left: {
            value: -5,
            left: null,
            right: null,
          },
          right: {
            value: -2,
            left: null,
            right: {
              value: 3,
              left: null,
              right: null,
            },
          },
        },
      },
      {
        args: [[0, 2, -5, 3, 1]],
        expected: {
          value: 0,
          left: {
            value: -5,
            left: null,
            right: null,
          },
          right: {
            value: 2,
            left: {
              value: 1,
              left: null,
              right: null,
            },
            right: {
              value: 3,
              left: null,
              right: null,
            },
          },
        },
      },
      {
        args: [[5, -4, 5, -2, 0, 5, -5]],
        expected: {
          value: -2,
          left: {
            value: -4,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: null,
          },
          right: {
            value: 5,
            left: {
              value: 0,
              left: null,
              right: null,
            },
            right: null,
          },
        },
      },
    ],
    77: [
      {
        args: [
          {
            value: -5,
            left: {
              value: -6,
              left: null,
              right: null,
            },
            right: {
              value: -2,
              left: {
                value: -3,
                left: null,
                right: null,
              },
              right: {
                value: 0,
                left: null,
                right: {
                  value: 5,
                  left: null,
                  right: null,
                },
              },
            },
          },
          3,
        ],
        expected: -2,
      },
      {
        args: [
          {
            value: 7,
            left: {
              value: 6,
              left: {
                value: 4,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
          9,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: -5,
              left: {
                value: -7,
                left: null,
                right: null,
              },
              right: {
                value: 0,
                left: null,
                right: null,
              },
            },
            right: {
              value: 3,
              left: null,
              right: null,
            },
          },
          -6,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -5,
            left: null,
            right: {
              value: 4,
              left: {
                value: 1,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          -4,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
          1,
        ],
        expected: -3,
      },
      {
        args: [
          {
            value: -5,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: -3,
              left: null,
              right: {
                value: -2,
                left: null,
                right: {
                  value: 7,
                  left: {
                    value: 4,
                    left: null,
                    right: null,
                  },
                  right: null,
                },
              },
            },
          },
          3,
        ],
        expected: -2,
      },
      {
        args: [
          {
            value: -4,
            left: null,
            right: null,
          },
          8,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -7,
            left: null,
            right: {
              value: 3,
              left: {
                value: 2,
                left: {
                  value: -3,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: 5,
                left: null,
                right: {
                  value: 8,
                  left: null,
                  right: null,
                },
              },
            },
          },
          7,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 5,
            left: null,
            right: null,
          },
          3,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -4,
              left: null,
              right: {
                value: 2,
                left: {
                  value: -2,
                  left: null,
                  right: null,
                },
                right: {
                  value: 3,
                  left: null,
                  right: {
                    value: 7,
                    left: null,
                    right: null,
                  },
                },
              },
            },
            right: null,
          },
          9,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: 5,
              left: null,
              right: null,
            },
          },
          -1,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: 7,
              left: {
                value: -5,
                left: null,
                right: {
                  value: 5,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: null,
          },
          -6,
        ],
        expected: null,
      },
    ],
    78: [
      {
        args: [
          {
            value: 1,
            left: {
              value: -4,
              left: {
                value: -5,
                left: null,
                right: null,
              },
              right: {
                value: 0,
                left: null,
                right: null,
              },
            },
            right: {
              value: 7,
              left: {
                value: 2,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          -8,
          3,
        ],
        expected: null,
      },
      {
        args: [null, -5, -7],
        expected: null,
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: null,
          },
          -7,
          -3,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -4,
              left: {
                value: -7,
                left: null,
                right: null,
              },
              right: {
                value: -2,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          6,
          -6,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: 6,
              left: null,
              right: null,
            },
          },
          -1,
          -3,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -5,
            left: null,
            right: {
              value: 0,
              left: {
                value: -1,
                left: {
                  value: -3,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: 6,
                left: null,
                right: null,
              },
            },
          },
          -6,
          -5,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 6,
            left: {
              value: 2,
              left: {
                value: -3,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
          6,
          -5,
        ],
        expected: null,
      },
      {
        args: [null, 0, -3],
        expected: null,
      },
      {
        args: [
          {
            value: 3,
            left: null,
            right: null,
          },
          2,
          6,
        ],
        expected: null,
      },
      {
        args: [null, 8, 5],
        expected: null,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: 2,
              left: {
                value: -1,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
          -6,
          8,
        ],
        expected: null,
      },
      {
        args: [null, -6, -3],
        expected: null,
      },
    ],
    79: [
      {
        args: [
          [5, -1, 1],
          [
            ["set", 2, 1],
            ["sum", 0, 1],
            ["set", 1, 3],
            ["sum", 0, 1],
            ["sum", 0, 1],
          ],
        ],
        expected: [4, 8, 8],
      },
      {
        args: [
          [2, -4, 2, 2, -1, -5],
          [
            ["sum", 1, 4],
            ["sum", 4, 4],
            ["sum", 1, 4],
          ],
        ],
        expected: [-1, -1, -1],
      },
      {
        args: [
          [4],
          [
            ["sum", 0, 0],
            ["sum", 0, 0],
            ["set", 0, 2],
            ["set", 0, 4],
          ],
        ],
        expected: [4, 4],
      },
      {
        args: [
          [2, -3, -4, 4, 1, 3, 0],
          [
            ["sum", 0, 5],
            ["sum", 3, 6],
            ["sum", 3, 5],
          ],
        ],
        expected: [3, 8, 8],
      },
      {
        args: [
          [2, 2, -3, 2, 2, 5],
          [
            ["sum", 0, 4],
            ["sum", 4, 4],
          ],
        ],
        expected: [5, 2],
      },
      {
        args: [
          [0, -3, -2, 2, -4, -5],
          [
            ["sum", 4, 5],
            ["set", 4, 2],
            ["set", 2, -2],
            ["set", 3, 1],
          ],
        ],
        expected: [-9],
      },
      {
        args: [
          [-1, 5, 0, 5, 0],
          [
            ["sum", 1, 3],
            ["set", 3, -5],
            ["sum", 0, 2],
            ["sum", 2, 3],
            ["sum", 0, 4],
            ["set", 2, -4],
          ],
        ],
        expected: [10, 4, -5, -1],
      },
      {
        args: [[-5, -5, 0, -3, 5], []],
        expected: [],
      },
      {
        args: [[5, 2, -5], [["set", 2, -5]]],
        expected: [],
      },
      {
        args: [
          [5, 4, 1, 1, 2],
          [
            ["sum", 1, 3],
            ["set", 1, 5],
          ],
        ],
        expected: [6],
      },
      {
        args: [
          [-5, -2, 1, -4, 0, -5, 0],
          [
            ["set", 0, -2],
            ["set", 4, -2],
            ["sum", 1, 3],
            ["set", 0, 3],
          ],
        ],
        expected: [-5],
      },
      {
        args: [
          [-4, 4],
          [
            ["sum", 0, 1],
            ["set", 1, 1],
            ["sum", 1, 1],
            ["set", 1, -4],
            ["sum", 1, 1],
          ],
        ],
        expected: [0, 1, -4],
      },
    ],
    80: [
      {
        args: [
          3,
          [
            [2, 0],
            [0, 0],
            [0, 2],
            [2, 0],
            [1, 1],
          ],
        ],
        expected: true,
      },
      {
        args: [1, [[0, 0]]],
        expected: true,
      },
      {
        args: [
          5,
          [
            [4, 1],
            [3, 3],
          ],
        ],
        expected: true,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: true,
      },
      {
        args: [
          5,
          [
            [1, 1],
            [1, 2],
            [4, 1],
            [1, 3],
          ],
        ],
        expected: true,
      },
      {
        args: [
          4,
          [
            [2, 3],
            [0, 2],
            [0, 2],
            [2, 2],
            [1, 2],
            [2, 3],
          ],
        ],
        expected: true,
      },
      {
        args: [
          5,
          [
            [3, 4],
            [2, 2],
            [0, 3],
            [1, 1],
          ],
        ],
        expected: true,
      },
      {
        args: [3, []],
        expected: false,
      },
      {
        args: [
          2,
          [
            [1, 1],
            [0, 0],
          ],
        ],
        expected: true,
      },
      {
        args: [
          3,
          [
            [0, 2],
            [0, 1],
            [1, 1],
            [2, 2],
            [0, 0],
            [0, 1],
          ],
        ],
        expected: true,
      },
      {
        args: [
          4,
          [
            [0, 1],
            [1, 2],
            [1, 0],
            [0, 1],
          ],
        ],
        expected: true,
      },
      {
        args: [1, []],
        expected: false,
      },
    ],
    81: [
      {
        args: [4, []],
        expected: [[0], [1], [2], [3]],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 0],
            [1, 0],
            [0, 1],
            [1, 0],
            [1, 1],
          ],
        ],
        expected: [[0, 1]],
      },
      {
        args: [
          2,
          [
            [1, 1],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ],
        expected: [[0], [1]],
      },
      {
        args: [
          4,
          [
            [2, 2],
            [0, 1],
            [0, 3],
            [2, 3],
            [0, 1],
            [1, 3],
          ],
        ],
        expected: [[0], [1], [2], [3]],
      },
      {
        args: [
          5,
          [
            [4, 3],
            [1, 1],
          ],
        ],
        expected: [[0], [1], [2], [3], [4]],
      },
      {
        args: [
          4,
          [
            [2, 1],
            [0, 1],
            [3, 2],
          ],
        ],
        expected: [[0], [1], [2], [3]],
      },
      {
        args: [
          3,
          [
            [1, 2],
            [2, 1],
            [2, 1],
            [2, 1],
          ],
        ],
        expected: [[0], [1, 2]],
      },
      {
        args: [
          5,
          [
            [4, 3],
            [2, 2],
            [3, 2],
            [2, 1],
          ],
        ],
        expected: [[0], [1], [2], [3], [4]],
      },
      {
        args: [1, [[0, 0]]],
        expected: [[0]],
      },
      {
        args: [
          2,
          [
            [1, 1],
            [1, 0],
            [1, 0],
          ],
        ],
        expected: [[0], [1]],
      },
      {
        args: [4, [[2, 1]]],
        expected: [[0], [1], [2], [3]],
      },
      {
        args: [
          3,
          [
            [2, 0],
            [2, 0],
            [0, 2],
            [0, 1],
            [0, 1],
          ],
        ],
        expected: [[0, 2], [1]],
      },
    ],
    82: [
      {
        args: [
          5,
          [
            [3, 1],
            [4, 1],
          ],
        ],
        expected: [0, 1],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          3,
          [
            [1, 2],
            [2, 1],
            [0, 2],
            [2, 0],
            [2, 0],
            [2, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [1, [[0, 0]]],
        expected: [],
      },
      {
        args: [3, []],
        expected: [],
      },
      {
        args: [1, []],
        expected: [],
      },
      {
        args: [4, []],
        expected: [],
      },
      {
        args: [
          5,
          [
            [3, 4],
            [0, 0],
            [2, 1],
            [4, 1],
            [3, 0],
            [4, 3],
          ],
        ],
        expected: [2, 3, 4],
      },
      {
        args: [5, [[3, 0]]],
        expected: [0],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          4,
          [
            [3, 3],
            [3, 2],
          ],
        ],
        expected: [1],
      },
      {
        args: [5, [[0, 4]]],
        expected: [0],
      },
    ],
    83: [
      {
        args: [
          4,
          [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 1],
          ],
        ],
        expected: [1],
      },
      {
        args: [
          4,
          [
            [1, 3],
            [2, 2],
            [2, 1],
            [3, 2],
            [1, 0],
            [2, 3],
          ],
        ],
        expected: [1],
      },
      {
        args: [3, [[2, 2]]],
        expected: [],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 1],
            [0, 0],
            [1, 0],
            [0, 1],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          [
            [1, 1],
            [1, 1],
            [0, 0],
            [1, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [0, []],
        expected: [],
      },
      {
        args: [
          3,
          [
            [0, 0],
            [0, 2],
            [1, 2],
            [2, 2],
            [0, 0],
          ],
        ],
        expected: [2],
      },
      {
        args: [
          3,
          [
            [1, 1],
            [1, 0],
            [2, 2],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          3,
          [
            [0, 1],
            [2, 1],
            [0, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 0],
            [0, 0],
            [1, 1],
            [1, 1],
          ],
        ],
        expected: [],
      },
      {
        args: [
          4,
          [
            [2, 1],
            [2, 0],
            [0, 3],
            [2, 0],
          ],
        ],
        expected: [0, 2],
      },
      {
        args: [
          3,
          [
            [2, 1],
            [1, 1],
            [1, 2],
          ],
        ],
        expected: [],
      },
    ],
    84: [
      {
        args: [3, [], 0],
        expected: [0, null, null],
      },
      {
        args: [
          3,
          [
            [0, 1, 4],
            [0, 0, -2],
            [1, 0, -3],
            [2, 1, -2],
          ],
          0,
        ],
        expected: [],
      },
      {
        args: [3, [], 1],
        expected: [null, 0, null],
      },
      {
        args: [5, [], 0],
        expected: [0, null, null, null, null],
      },
      {
        args: [5, [[0, 0, -1]], 4],
        expected: [],
      },
      {
        args: [4, [], 1],
        expected: [null, 0, null, null],
      },
      {
        args: [2, [], 0],
        expected: [0, null],
      },
      {
        args: [
          1,
          [
            [0, 0, 2],
            [0, 0, -3],
            [0, 0, -3],
          ],
          0,
        ],
        expected: [],
      },
      {
        args: [2, [[0, 1, 3]], 1],
        expected: [null, 0],
      },
      {
        args: [5, [[3, 4, -1]], 2],
        expected: [null, null, 0, null, null],
      },
      {
        args: [2, [[0, 1, -4]], 0],
        expected: [0, -4],
      },
      {
        args: [5, [], 2],
        expected: [null, null, 0, null, null],
      },
    ],
    85: [
      {
        args: [
          5,
          [
            [4, 4, -1],
            [0, 4, 4],
            [4, 1, 0],
            [4, 3, -3],
            [4, 4, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          4,
          [
            [1, 2, 4],
            [2, 3, 5],
            [3, 0, 3],
          ],
        ],
        expected: [
          [0, null, null, null],
          [12, 0, 4, 9],
          [8, null, 0, 5],
          [3, null, null, 0],
        ],
      },
      {
        args: [
          1,
          [
            [0, 0, 3],
            [0, 0, -1],
            [0, 0, 3],
            [0, 0, -2],
            [0, 0, -2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          4,
          [
            [0, 0, 0],
            [2, 3, 3],
            [0, 2, 3],
            [0, 3, 2],
            [3, 0, -3],
          ],
        ],
        expected: [],
      },
      {
        args: [
          5,
          [
            [3, 3, -2],
            [1, 1, 4],
            [2, 4, -1],
            [0, 2, 0],
            [2, 1, -3],
            [4, 2, 5],
          ],
        ],
        expected: [],
      },
      {
        args: [
          5,
          [
            [1, 1, 3],
            [0, 2, -2],
            [3, 2, 0],
            [2, 0, -2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          [
            [0, 0, -2],
            [0, 1, 0],
            [0, 1, -2],
            [0, 0, -2],
            [0, 0, 5],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          [
            [1, 0, 3],
            [0, 1, -1],
            [0, 0, 1],
            [0, 1, -3],
          ],
        ],
        expected: [
          [0, -3],
          [3, 0],
        ],
      },
      {
        args: [3, [[1, 2, -2]]],
        expected: [
          [0, null, null],
          [null, 0, -2],
          [null, null, 0],
        ],
      },
      {
        args: [
          5,
          [
            [0, 3, -1],
            [4, 4, -2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          3,
          [
            [0, 1, 1],
            [2, 1, 2],
            [2, 1, 1],
          ],
        ],
        expected: [
          [0, 1, null],
          [null, 0, null],
          [null, 1, 0],
        ],
      },
      {
        args: [
          4,
          [
            [2, 1, -2],
            [3, 1, 2],
            [0, 2, 0],
            [0, 1, 3],
          ],
        ],
        expected: [
          [0, -2, 0, null],
          [null, 0, null, null],
          [null, -2, 0, null],
          [null, 2, null, 0],
        ],
      },
    ],
    86: [
      {
        args: [
          2,
          [
            [1, 1, 4],
            [1, 1, 2],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [1, 3, -2],
            [0, 2, 3],
            [3, 2, -2],
            [0, 3, 5],
            [0, 1, -1],
          ],
        ],
        expected: -5,
      },
      {
        args: [
          4,
          [
            [3, 0, 6],
            [2, 2, -3],
            [1, 0, 6],
            [1, 2, -3],
          ],
        ],
        expected: 9,
      },
      {
        args: [2, [[0, 1, 2]]],
        expected: 2,
      },
      {
        args: [
          1,
          [
            [0, 0, 0],
            [0, 0, 5],
            [0, 0, -3],
            [0, 0, 5],
            [0, 0, 1],
            [0, 0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [2, 1, 0],
            [2, 2, -1],
            [1, 1, -2],
            [0, 0, 4],
            [2, 1, 6],
            [0, 1, 4],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          5,
          [
            [2, 1, 4],
            [3, 1, 0],
            [2, 3, -1],
          ],
        ],
        expected: -1,
      },
      {
        args: [4, [[2, 0, 0]]],
        expected: -1,
      },
      {
        args: [
          5,
          [
            [0, 3, 0],
            [0, 0, 6],
            [3, 4, -2],
          ],
        ],
        expected: -1,
      },
      {
        args: [3, [[0, 2, -3]]],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [1, 2, -2],
            [0, 1, 1],
            [2, 1, -1],
            [2, 0, -1],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          5,
          [
            [4, 2, -1],
            [4, 4, 4],
            [2, 2, -2],
            [2, 1, 5],
            [0, 1, -1],
            [4, 3, -3],
          ],
        ],
        expected: 0,
      },
    ],
    87: [
      {
        args: [
          6,
          [
            [0, 1, 1],
            [0, 2, 1],
            [1, 3, 1],
            [1, 4, 1],
            [2, 3, 1],
            [3, 5, 1],
            [4, 5, 1],
          ],
          0,
          5,
        ],
        expected: 2,
      },
      {
        args: [3, [], 0, 2],
        expected: 0,
      },
      {
        args: [
          5,
          [
            [3, 4, 2],
            [4, 2, 3],
          ],
          0,
          4,
        ],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [0, 1, 1],
            [1, 1, 2],
            [1, 1, 3],
            [1, 1, 0],
          ],
          0,
          1,
        ],
        expected: 1,
      },
      {
        args: [4, [[0, 0, 4]], 0, 3],
        expected: 0,
      },
      {
        args: [
          5,
          [
            [4, 2, 3],
            [1, 2, 3],
            [0, 4, 1],
            [1, 4, 4],
            [2, 2, 3],
          ],
          0,
          4,
        ],
        expected: 1,
      },
      {
        args: [
          5,
          [
            [4, 4, 0],
            [1, 0, 1],
            [4, 2, 1],
            [0, 2, 2],
            [2, 3, 0],
          ],
          0,
          4,
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [1, 1, 0],
            [2, 0, 1],
            [3, 2, 1],
            [3, 3, 0],
            [0, 0, 3],
            [3, 3, 2],
            [1, 1, 2],
          ],
          0,
          3,
        ],
        expected: 0,
      },
      {
        args: [5, [[2, 3, 1]], 0, 4],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [2, 2, 2],
            [1, 3, 2],
          ],
          0,
          3,
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [1, 1, 2],
            [1, 1, 4],
            [2, 0, 2],
          ],
          0,
          2,
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [1, 0, 4],
            [2, 3, 3],
            [1, 0, 4],
          ],
          0,
          3,
        ],
        expected: 0,
      },
    ],
    88: [
      {
        args: [0, 4, []],
        expected: 0,
      },
      {
        args: [3, 0, []],
        expected: 0,
      },
      {
        args: [4, 0, []],
        expected: 0,
      },
      {
        args: [
          2,
          4,
          [
            [1, 3],
            [0, 3],
            [0, 1],
            [0, 1],
            [1, 0],
            [1, 2],
            [0, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [0, 2, []],
        expected: 0,
      },
      {
        args: [0, 1, []],
        expected: 0,
      },
      {
        args: [3, 3, [[2, 1]]],
        expected: 1,
      },
      {
        args: [3, 2, [[2, 1]]],
        expected: 1,
      },
      {
        args: [
          3,
          2,
          [
            [2, 0],
            [0, 0],
            [2, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          3,
          3,
          [
            [2, 2],
            [0, 2],
            [1, 2],
            [0, 2],
            [2, 1],
            [2, 1],
            [1, 0],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          1,
          4,
          [
            [0, 1],
            [0, 2],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          2,
          1,
          [
            [1, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [1, 0],
          ],
        ],
        expected: 1,
      },
    ],
    89: [
      {
        args: [[4, 2, 3, 1]],
        expected: 14,
      },
      {
        args: [[4, 1, 7, 2, 7]],
        expected: 56,
      },
      {
        args: [[8, 1, 2]],
        expected: 16,
      },
      {
        args: [[4, 2]],
        expected: 0,
      },
      {
        args: [[1, 4, 7, 1]],
        expected: 32,
      },
      {
        args: [[3, 2, 5]],
        expected: 30,
      },
      {
        args: [[7, 8, 5, 4, 7]],
        expected: 580,
      },
      {
        args: [[2, 7, 4, 3, 7]],
        expected: 122,
      },
      {
        args: [[5, 7, 8, 6, 5]],
        expected: 670,
      },
      {
        args: [[2, 5, 6, 6]],
        expected: 132,
      },
      {
        args: [[3, 3, 1, 5]],
        expected: 24,
      },
      {
        args: [[4]],
        expected: 0,
      },
    ],
    90: [
      {
        args: [
          {
            value: 7,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        ],
        expected: 8,
      },
      {
        args: [
          {
            value: -2,
            left: null,
            right: {
              value: 4,
              left: {
                value: 3,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: 4,
      },
      {
        args: [
          {
            value: -7,
            left: null,
            right: {
              value: -5,
              left: {
                value: -6,
                left: null,
                right: null,
              },
              right: {
                value: 8,
                left: {
                  value: 5,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
        ],
        expected: 8,
      },
      {
        args: [
          {
            value: -4,
            left: null,
            right: {
              value: 7,
              left: {
                value: 5,
                left: {
                  value: -3,
                  left: null,
                  right: {
                    value: 3,
                    left: null,
                    right: null,
                  },
                },
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: 10,
      },
      {
        args: [
          {
            value: 7,
            left: {
              value: -1,
              left: {
                value: -2,
                left: null,
                right: null,
              },
              right: {
                value: 4,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: 11,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -6,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
        ],
        expected: 8,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -2,
              left: null,
              right: null,
            },
            right: {
              value: 6,
              left: null,
              right: null,
            },
          },
        ],
        expected: 6,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -2,
              left: {
                value: -5,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 8,
              left: {
                value: 3,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: 8,
      },
      {
        args: [
          {
            value: 6,
            left: null,
            right: null,
          },
        ],
        expected: 6,
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: null,
          },
        ],
        expected: 0,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -6,
              left: null,
              right: null,
            },
            right: {
              value: 7,
              left: {
                value: 6,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: 7,
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -6,
              left: null,
              right: null,
            },
            right: {
              value: 8,
              left: {
                value: 3,
                left: {
                  value: -2,
                  left: null,
                  right: {
                    value: 2,
                    left: null,
                    right: null,
                  },
                },
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: 10,
      },
    ],
    91: [
      {
        args: [[[0]]],
        expected: 0,
      },
      {
        args: [
          [
            [0, 1],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [0, 2, 5, 5, 4],
            [4, 0, 7, null, null],
            [7, null, 0, null, null],
            [7, null, 5, 0, 5],
            [1, 5, 2, 1, 0],
          ],
        ],
        expected: 29,
      },
      {
        args: [
          [
            [0, 6, 6, 2],
            [6, 0, null, 3],
            [1, null, 0, 2],
            [4, 0, 6, 0],
          ],
        ],
        expected: 14,
      },
      {
        args: [
          [
            [0, 3, null, 6],
            [3, 0, 5, 1],
            [7, null, 0, 7],
            [null, null, 1, 0],
          ],
        ],
        expected: 12,
      },
      {
        args: [
          [
            [0, 2, 0, 4],
            [3, 0, 5, null],
            [null, 2, 0, null],
            [2, 5, null, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [
            [0, 0, null, 2, null],
            [1, 0, 2, null, null],
            [3, null, 0, 6, 5],
            [1, 5, 1, 0, 1],
            [4, null, 2, 6, 0],
          ],
        ],
        expected: 13,
      },
      {
        args: [
          [
            [0, null, null, null, null],
            [5, 0, null, 1, 5],
            [1, null, 0, 3, 2],
            [6, 7, 2, 0, 1],
            [2, 2, null, 1, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [
            [0, 7, null, 4],
            [6, 0, null, null],
            [null, 0, 0, 3],
            [2, 3, 1, 0],
          ],
        ],
        expected: 11,
      },
      {
        args: [
          [
            [0, null],
            [4, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [
            [0, 4],
            [7, 0],
          ],
        ],
        expected: 11,
      },
      {
        args: [
          [
            [0, 7, 3, 4],
            [7, 0, 4, 1],
            [5, 1, 0, 4],
            [6, 0, 0, 0],
          ],
        ],
        expected: 11,
      },
    ],
    92: [
      {
        args: [[3, 5, 3, -1, -3, -1, 1]],
        expected: [4, 5, 6],
      },
      {
        args: [[2, -4, -1]],
        expected: [1, 2],
      },
      {
        args: [[-2]],
        expected: [0],
      },
      {
        args: [[0, 3]],
        expected: [0, 1],
      },
      {
        args: [[-2, -3, -3, 2, 5]],
        expected: [0, 3, 4],
      },
      {
        args: [[1, 0, 0]],
        expected: [0],
      },
      {
        args: [[-4, 5, 5]],
        expected: [0, 1],
      },
      {
        args: [[-3, 5]],
        expected: [0, 1],
      },
      {
        args: [[-3, 2, -2, 2, 2, 2]],
        expected: [0, 2, 3],
      },
      {
        args: [[-2, 0, 2, 0]],
        expected: [0, 1, 2],
      },
      {
        args: [[3, 2, -2, 2]],
        expected: [2, 3],
      },
      {
        args: [[-4, 1, -1, -3]],
        expected: [0, 1],
      },
    ],
    93: [
      {
        args: [[1, -3, -2, 1], 2],
        expected: [1, -2, 1],
      },
      {
        args: [[-3, 3, -2, 1, 0, -1], 3],
        expected: [3, 3, 1, 1],
      },
      {
        args: [[3, 3], 8],
        expected: [],
      },
      {
        args: [[5, -5], 9],
        expected: [],
      },
      {
        args: [[-2, 5, 2, 0, 1, -1], 9],
        expected: [],
      },
      {
        args: [[-2, -5, 5, 5], 4],
        expected: [5],
      },
      {
        args: [[-3, 3, 5, -2, -1, 0, 3], 2],
        expected: [3, 5, 5, -1, 0, 3],
      },
      {
        args: [[], -1],
        expected: [],
      },
      {
        args: [[4, -5, 3, 2], 2],
        expected: [4, 3, 3],
      },
      {
        args: [[], 8],
        expected: [],
      },
      {
        args: [[1], 5],
        expected: [],
      },
      {
        args: [[-4], 2],
        expected: [],
      },
    ],
    94: [
      {
        args: [
          [
            [-4, -1],
            [-4, 6],
            [-1, -1],
          ],
        ],
        expected: 10,
      },
      {
        args: [[[-4, 6]]],
        expected: 10,
      },
      {
        args: [
          [
            [5, 5],
            [5, 6],
            [-3, 3],
            [-3, 3],
            [0, 6],
          ],
        ],
        expected: 9,
      },
      {
        args: [
          [
            [2, 4],
            [-2, 1],
            [5, 5],
            [4, 5],
          ],
        ],
        expected: 6,
      },
      {
        args: [
          [
            [2, 2],
            [1, 5],
          ],
        ],
        expected: 4,
      },
      {
        args: [[[-4, 0]]],
        expected: 4,
      },
      {
        args: [
          [
            [-4, 2],
            [-1, 2],
            [3, 6],
            [0, 5],
            [-3, 6],
          ],
        ],
        expected: 10,
      },
      {
        args: [
          [
            [0, 2],
            [-3, -2],
            [-4, 0],
            [-2, 0],
            [1, 6],
          ],
        ],
        expected: 10,
      },
      {
        args: [
          [
            [1, 2],
            [2, 2],
            [1, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [-1, 1],
            [-2, 1],
            [-3, 6],
          ],
        ],
        expected: 9,
      },
      {
        args: [
          [
            [4, 5],
            [-1, 0],
            [-3, 1],
          ],
        ],
        expected: 5,
      },
      {
        args: [[[-2, 2]]],
        expected: 4,
      },
    ],
    95: [
      {
        args: [1],
        expected: 1,
      },
      {
        args: [3],
        expected: 0,
      },
      {
        args: [5],
        expected: 10,
      },
      {
        args: [6],
        expected: 4,
      },
      {
        args: [7],
        expected: 40,
      },
      {
        args: [8],
        expected: 92,
      },
    ],
    96: [
      {
        args: [0, 18, 12],
        expected: 0,
      },
      {
        args: [-1, 20, 4],
        expected: 1,
      },
      {
        args: [1, 5, 11],
        expected: 1,
      },
      {
        args: [1, 18, 9],
        expected: 1,
      },
      {
        args: [3, 5, 10],
        expected: 3,
      },
      {
        args: [1, 3, 6],
        expected: 1,
      },
      {
        args: [1, 4, 12],
        expected: 1,
      },
      {
        args: [-3, 16, 9],
        expected: 0,
      },
      {
        args: [1, 16, 14],
        expected: 1,
      },
      {
        args: [-2, 2, 2],
        expected: 0,
      },
      {
        args: [4, 14, 7],
        expected: 2,
      },
      {
        args: [-4, 0, 2],
        expected: 1,
      },
    ],
    97: [
      {
        args: [62],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61],
      },
      {
        args: [30],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
      },
      {
        args: [9],
        expected: [2, 3, 5, 7],
      },
      {
        args: [38],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37],
      },
      {
        args: [28],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23],
      },
      {
        args: [52],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
      },
      {
        args: [67],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67],
      },
      {
        args: [12],
        expected: [2, 3, 5, 7, 11],
      },
      {
        args: [53],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53],
      },
      {
        args: [56],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53],
      },
      {
        args: [17],
        expected: [2, 3, 5, 7, 11, 13, 17],
      },
      {
        args: [61],
        expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61],
      },
    ],
    98: [
      {
        args: [7, 7, 6],
        expected: 1,
      },
      {
        args: [1, -1, 2],
        expected: 0,
      },
      {
        args: [8, 9, 3],
        expected: 0,
      },
      {
        args: [6, 5, 16],
        expected: 6,
      },
      {
        args: [8, 7, 7],
        expected: 1,
      },
      {
        args: [1, -1, 1],
        expected: 0,
      },
      {
        args: [2, 2, 3],
        expected: 1,
      },
      {
        args: [6, 4, 5],
        expected: 0,
      },
      {
        args: [6, 7, 12],
        expected: 0,
      },
      {
        args: [3, 1, 7],
        expected: 3,
      },
      {
        args: [8, 0, 11],
        expected: 1,
      },
      {
        args: [3, 0, 3],
        expected: 1,
      },
    ],
    99: [
      {
        args: [[0, -1, 4, 3], 3, 36],
        expected: 4,
      },
      {
        args: [[0], 0, 11],
        expected: 0,
      },
      {
        args: [[-3, -1], 0, 86],
        expected: -3,
      },
      {
        args: [[-5, -2, -3, -3, 0, 5], 0, 62],
        expected: -5,
      },
      {
        args: [[-1, -1, 2, 4, 3, 1], 0, 70],
        expected: -1,
      },
      {
        args: [[3], 0, 9],
        expected: 3,
      },
      {
        args: [[4, 5], 0, 16],
        expected: 4,
      },
      {
        args: [[-3], 0, 74],
        expected: -3,
      },
      {
        args: [[2, -4, -4, -1, 3], 1, 66],
        expected: -4,
      },
      {
        args: [[3, 2], 1, 97],
        expected: 3,
      },
      {
        args: [[2, 5, 2, -3, -1, -3], 3, 2],
        expected: 2,
      },
      {
        args: [[0], 0, 25],
        expected: 0,
      },
    ],
    100: [
      {
        args: [1, []],
        expected: [],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [0],
      },
      {
        args: [2, []],
        expected: [],
      },
      {
        args: [4, [[1, 0]]],
        expected: [0],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [0],
      },
      {
        args: [
          3,
          [
            [1, 0],
            [2, 0],
            [2, 2],
          ],
        ],
        expected: [0, 2],
      },
      {
        args: [
          2,
          [
            [0, 1],
            [1, 0],
            [0, 1],
          ],
        ],
        expected: [0],
      },
      {
        args: [
          5,
          [
            [4, 0],
            [1, 4],
            [4, 3],
            [1, 4],
            [3, 2],
            [4, 3],
          ],
        ],
        expected: [2, 4],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [0, 0],
            [1, 0],
            [1, 0],
          ],
        ],
        expected: [0],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 1],
            [1, 0],
            [1, 0],
            [0, 0],
            [0, 1],
          ],
        ],
        expected: [0, 1],
      },
      {
        args: [
          5,
          [
            [3, 0],
            [4, 4],
            [4, 1],
          ],
        ],
        expected: [0, 4],
      },
      {
        args: [5, []],
        expected: [],
      },
    ],
    101: [
      {
        args: [4, []],
        expected: [],
      },
      {
        args: [5, [[3, 1]]],
        expected: [1, 3],
      },
      {
        args: [1, []],
        expected: [],
      },
      {
        args: [3, [[0, 2]]],
        expected: [0, 2],
      },
      {
        args: [
          3,
          [
            [0, 1],
            [0, 1],
            [0, 1],
          ],
        ],
        expected: [0, 1],
      },
      {
        args: [
          5,
          [
            [4, 0],
            [0, 3],
            [4, 0],
          ],
        ],
        expected: [0, 4],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [0, 1],
          ],
        ],
        expected: [0, 1],
      },
      {
        args: [
          5,
          [
            [4, 2],
            [4, 0],
            [3, 4],
            [0, 4],
          ],
        ],
        expected: [2, 4],
      },
      {
        args: [
          4,
          [
            [1, 0],
            [1, 0],
            [3, 2],
            [0, 2],
            [1, 0],
          ],
        ],
        expected: [0, 1, 2, 3],
      },
      {
        args: [
          3,
          [
            [2, 1],
            [0, 2],
          ],
        ],
        expected: [1, 2],
      },
      {
        args: [
          4,
          [
            [1, 0],
            [2, 3],
            [0, 1],
            [1, 3],
            [1, 3],
          ],
        ],
        expected: [0, 1, 2, 3],
      },
      {
        args: [
          4,
          [
            [2, 0],
            [0, 2],
            [0, 1],
            [3, 2],
            [3, 1],
            [1, 2],
          ],
        ],
        expected: [0, 1, 2, 3],
      },
    ],
    102: [
      {
        args: [
          [
            [-3, 0, 3],
            [1, 7, 1],
            [-1, 5, 0],
            [-2, 4, 3],
            [2, 7, 5],
          ],
        ],
        expected: 8,
      },
      {
        args: [
          [
            [1, 5, -3],
            [0, 5, 6],
            [-1, 5, -1],
            [-3, 1, -2],
            [2, 3, -3],
          ],
        ],
        expected: 6,
      },
      {
        args: [
          [
            [-4, 3, 5],
            [-1, 2, 3],
            [2, 5, 1],
          ],
        ],
        expected: 5,
      },
      {
        args: [[[-1, 5, 0]]],
        expected: 0,
      },
      {
        args: [
          [
            [-2, 0, 5],
            [-1, 7, 0],
            [5, 7, 8],
            [-1, 7, 7],
          ],
        ],
        expected: 13,
      },
      {
        args: [[[4, 5, 7]]],
        expected: 7,
      },
      {
        args: [[[4, 7, -2]]],
        expected: 0,
      },
      {
        args: [
          [
            [1, 5, 6],
            [2, 7, 6],
          ],
        ],
        expected: 6,
      },
      {
        args: [
          [
            [5, 6, 1],
            [-1, 6, 0],
            [-1, 5, 8],
            [-4, 1, 7],
          ],
        ],
        expected: 9,
      },
      {
        args: [
          [
            [-4, 1, 4],
            [3, 5, 9],
            [-2, 3, 4],
          ],
        ],
        expected: 13,
      },
      {
        args: [
          [
            [-4, 3, 4],
            [-1, 1, 8],
            [-4, -2, 6],
            [0, 6, 3],
            [-1, 6, -3],
          ],
        ],
        expected: 14,
      },
      {
        args: [
          [
            [0, 3, -1],
            [0, 3, -3],
            [5, 7, 7],
            [2, 4, 4],
          ],
        ],
        expected: 11,
      },
    ],
    103: [
      {
        args: ["ba", ""],
        expected: 0,
      },
      {
        args: ["B", "BBa"],
        expected: 1,
      },
      {
        args: ["bb", "BaBBb"],
        expected: 1,
      },
      {
        args: ["aB", "bBAbba"],
        expected: 1,
      },
      {
        args: ["aBa", "BA"],
        expected: 1,
      },
      {
        args: ["AbBABb", "Ab"],
        expected: 2,
      },
      {
        args: ["ABBaAA", "a"],
        expected: 1,
      },
      {
        args: ["aa", "bAaba"],
        expected: 2,
      },
      {
        args: ["AbAaaB", "A"],
        expected: 1,
      },
      {
        args: ["bbBBa", "aa"],
        expected: 1,
      },
      {
        args: ["", ""],
        expected: 0,
      },
      {
        args: ["bbB", "aAb"],
        expected: 1,
      },
    ],
    104: [
      {
        args: [2, [[0, 1, 1]], 0],
        expected: [0, 1],
      },
      {
        args: [
          1,
          [
            [0, 0, 1],
            [0, 0, 0],
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 0],
          ],
          0,
        ],
        expected: [0],
      },
      {
        args: [
          2,
          [
            [1, 1, 0],
            [0, 0, 1],
          ],
          1,
        ],
        expected: [null, 0],
      },
      {
        args: [
          5,
          [
            [1, 4, 0],
            [4, 1, 0],
            [4, 1, 1],
            [2, 2, 0],
          ],
          1,
        ],
        expected: [null, 0, null, null, 0],
      },
      {
        args: [
          2,
          [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
          ],
          0,
        ],
        expected: [0, null],
      },
      {
        args: [2, [[0, 0, 1]], 0],
        expected: [0, null],
      },
      {
        args: [3, [[0, 0, 0]], 1],
        expected: [null, 0, null],
      },
      {
        args: [
          4,
          [
            [0, 1, 0],
            [3, 0, 0],
            [3, 2, 1],
            [0, 2, 1],
            [3, 1, 1],
            [3, 0, 1],
          ],
          0,
        ],
        expected: [0, 0, 1, null],
      },
      {
        args: [
          5,
          [
            [0, 2, 1],
            [3, 1, 1],
          ],
          0,
        ],
        expected: [0, null, 1, null, null],
      },
      {
        args: [5, [[2, 4, 0]], 1],
        expected: [null, 0, null, null, null],
      },
      {
        args: [
          4,
          [
            [0, 3, 1],
            [2, 1, 0],
            [1, 1, 0],
            [1, 0, 0],
          ],
          3,
        ],
        expected: [null, null, null, 0],
      },
      {
        args: [
          1,
          [
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 0],
          ],
          0,
        ],
        expected: [0],
      },
    ],
    105: [
      {
        args: [8, 15],
        expected: 2,
      },
      {
        args: [4, 15],
        expected: 4,
      },
      {
        args: [-9, 11],
        expected: 6,
      },
      {
        args: [-8, 12],
        expected: null,
      },
      {
        args: [-2, 3],
        expected: 1,
      },
      {
        args: [-2, 8],
        expected: null,
      },
      {
        args: [-8, 16],
        expected: null,
      },
      {
        args: [1, 18],
        expected: 1,
      },
      {
        args: [-1, 13],
        expected: 12,
      },
      {
        args: [6, 6],
        expected: null,
      },
      {
        args: [0, 18],
        expected: null,
      },
      {
        args: [-3, 19],
        expected: 6,
      },
    ],
    106: [
      {
        args: [
          [
            [3, -2],
            [2, -2],
            [2, 2],
            [-2, 0],
            [-1, 3],
            [1, 1],
            [1, -1],
          ],
        ],
        expected: [
          [-2, 0],
          [2, -2],
          [3, -2],
          [2, 2],
          [-1, 3],
        ],
      },
      {
        args: [
          [
            [1, -2],
            [3, 2],
            [-3, 2],
            [0, -1],
            [2, 0],
          ],
        ],
        expected: [
          [-3, 2],
          [1, -2],
          [3, 2],
        ],
      },
      {
        args: [
          [
            [-3, 1],
            [-2, 1],
            [0, 3],
          ],
        ],
        expected: [
          [-3, 1],
          [-2, 1],
          [0, 3],
        ],
      },
      {
        args: [[[3, 1]]],
        expected: [[3, 1]],
      },
      {
        args: [[[2, -2]]],
        expected: [[2, -2]],
      },
      {
        args: [
          [
            [1, 3],
            [-3, 3],
            [2, 1],
            [-2, -3],
            [2, 1],
          ],
        ],
        expected: [
          [-3, 3],
          [-2, -3],
          [2, 1],
          [1, 3],
        ],
      },
      {
        args: [
          [
            [0, -3],
            [3, -3],
            [2, -1],
            [-1, 2],
          ],
        ],
        expected: [
          [-1, 2],
          [0, -3],
          [3, -3],
          [2, -1],
        ],
      },
      {
        args: [
          [
            [1, -2],
            [-2, 1],
            [-3, 2],
            [-1, -2],
            [-2, -1],
            [-1, 3],
          ],
        ],
        expected: [
          [-3, 2],
          [-2, -1],
          [-1, -2],
          [1, -2],
          [-1, 3],
        ],
      },
      {
        args: [
          [
            [3, -1],
            [2, -1],
            [1, -3],
            [-1, 3],
            [-2, -1],
            [0, 2],
            [1, -1],
          ],
        ],
        expected: [
          [-2, -1],
          [1, -3],
          [3, -1],
          [-1, 3],
        ],
      },
      {
        args: [
          [
            [-3, -3],
            [2, 0],
            [3, -1],
            [0, 1],
          ],
        ],
        expected: [
          [-3, -3],
          [3, -1],
          [2, 0],
          [0, 1],
        ],
      },
      {
        args: [
          [
            [-2, -3],
            [2, 3],
            [-3, 1],
            [0, 0],
            [2, -3],
            [-2, -3],
          ],
        ],
        expected: [
          [-3, 1],
          [-2, -3],
          [2, -3],
          [2, 3],
        ],
      },
      {
        args: [
          [
            [3, 1],
            [0, -2],
            [2, -2],
            [-2, 2],
            [2, -2],
            [2, 2],
          ],
        ],
        expected: [
          [-2, 2],
          [0, -2],
          [2, -2],
          [3, 1],
          [2, 2],
        ],
      },
    ],
    107: [
      {
        args: ["b+aa", "aa"],
        expected: 2,
      },
      {
        args: ["Æa", "a"],
        expected: 1,
      },
      {
        args: ["", "b"],
        expected: -1,
      },
      {
        args: ["aBB", ""],
        expected: 0,
      },
      {
        args: ["bbAA", "aBaA"],
        expected: -1,
      },
      {
        args: ["aaBaB", "babA"],
        expected: -1,
      },
      {
        args: ["Bbaa", "Aa"],
        expected: -1,
      },
      {
        args: ["AB", "Aa"],
        expected: -1,
      },
      {
        args: ["Ba", "abbBb"],
        expected: -1,
      },
      {
        args: ["aAab", "BBb"],
        expected: -1,
      },
      {
        args: ["aaBaa", "a"],
        expected: 0,
      },
      {
        args: ["BAa", ""],
        expected: 0,
      },
    ],
  },
  check: {
    0: [
      {
        args: [[-2, -3, -1, -1, 3, -2], 3],
        expected: 1,
      },
      {
        args: [[-3], 1],
        expected: 0,
      },
      {
        args: [[], -1],
        expected: 0,
      },
      {
        args: [[-3, -2, 3, 3, 2], -1],
        expected: 0,
      },
      {
        args: [[], 3],
        expected: 0,
      },
      {
        args: [[-2, -3, 3], 3],
        expected: 1,
      },
      {
        args: [[1, 1, 2, 0, 1, -2], -2],
        expected: 1,
      },
      {
        args: [[-2, 3, 0, -2, -2, 0], 2],
        expected: 0,
      },
      {
        args: [[2, 3, 0, 0, 2], 2],
        expected: 2,
      },
      {
        args: [[2, -1, -1], -2],
        expected: 0,
      },
      {
        args: [[-2, 1, -1], -1],
        expected: 1,
      },
      {
        args: [[2, 1, -1, -3, 3, 3], 1],
        expected: 1,
      },
    ],
    1: [
      {
        args: [[3, 0]],
        expected: 0,
      },
      {
        args: [[1, -1, -3, -2]],
        expected: -6,
      },
      {
        args: [[3, 1, -3]],
        expected: -9,
      },
      {
        args: [[-1, 3, 1]],
        expected: -3,
      },
      {
        args: [[-2, 3, -3, -2, 3, -3]],
        expected: 324,
      },
      {
        args: [[-1, 0]],
        expected: 0,
      },
      {
        args: [[-2, -3, 1, 3, -1, 2]],
        expected: -36,
      },
      {
        args: [[3, -1]],
        expected: -3,
      },
      {
        args: [[3, 1]],
        expected: 3,
      },
      {
        args: [[3]],
        expected: 3,
      },
      {
        args: [[-1, 2, 3, -2, -2, -3]],
        expected: 72,
      },
      {
        args: [[3, -3, 0]],
        expected: 0,
      },
    ],
    2: [
      {
        args: [[7, 2, 9]],
        expected: [2, 9],
      },
      {
        args: [[-7, -2, -9]],
        expected: [-9, -2],
      },
      {
        args: [[4, 4, 4]],
        expected: [4, 4],
      },
      {
        args: [[-1, 3, 0]],
        expected: [-1, 3],
      },
      {
        args: [[-3, -2, 1, 0, 3, -1]],
        expected: [-3, 3],
      },
      {
        args: [[0, -1, 2]],
        expected: [-1, 2],
      },
      {
        args: [[2, -2, -3, 3, 1]],
        expected: [-3, 3],
      },
      {
        args: [[-3, 2, -2, -1]],
        expected: [-3, 2],
      },
      {
        args: [[3, -1, 2, -3, 1]],
        expected: [-3, 3],
      },
      {
        args: [[-2, -2]],
        expected: [-2, -2],
      },
      {
        args: [[-2, 1, 3, -3, 2, -3]],
        expected: [-3, 3],
      },
      {
        args: [[3, 1]],
        expected: [1, 3],
      },
    ],
    3: [
      {
        args: [[], []],
        expected: [],
      },
      {
        args: [[1], []],
        expected: [],
      },
      {
        args: [
          [1, 1],
          [1, 1, 1],
        ],
        expected: [1],
      },
      {
        args: [
          [1, 2, 5, 8],
          [2, 8],
        ],
        expected: [2, 8],
      },
      {
        args: [[1], [2, 3, 4]],
        expected: [],
      },
      {
        args: [
          [-3, -1],
          [-4, -3, -1, 0],
        ],
        expected: [-3, -1],
      },
      {
        args: [
          [-1, 2],
          [2, 3],
        ],
        expected: [2],
      },
      {
        args: [
          [0, 2, 2],
          [0, 0, 2],
        ],
        expected: [0, 2],
      },
      {
        args: [
          [0, 0],
          [-4, 0],
        ],
        expected: [0],
      },
      {
        args: [
          [-3, -3, -3, -3, -1, -1],
          [-3, -3, -3, -1],
        ],
        expected: [-3, -1],
      },
      {
        args: [[-3], [-3, 4]],
        expected: [-3],
      },
      {
        args: [
          [-2, -2, -1, 1, 2],
          [-2, -2, -1, -1],
        ],
        expected: [-2, -1],
      },
    ],
    4: [
      {
        args: [[5], 1, 5],
        expected: 0,
      },
      {
        args: [[1, 2, 3], 3, 6],
        expected: 0,
      },
      {
        args: [[0, 0, 1, 2], 3, 3],
        expected: 1,
      },
      {
        args: [[2, 2, 2], 2, 4],
        expected: 0,
      },
      {
        args: [[-9, -4, -2], 1, -3],
        expected: 2,
      },
      {
        args: [[1, 2, 3], 1, 3],
        expected: 2,
      },
      {
        args: [[1, 2, 3], 3, 7],
        expected: -1,
      },
      {
        args: [[1, 2, 3], 2, 3],
        expected: 0,
      },
      {
        args: [[], 1, 0],
        expected: -1,
      },
      {
        args: [[1], -1, 0],
        expected: -1,
      },
      {
        args: [[1], 2, 0],
        expected: -1,
      },
      {
        args: [[1, 2, 3], 2, 0],
        expected: 0,
      },
    ],
    5: [
      {
        args: [
          [2, -3, 4],
          [
            [0, 0],
            [2, 2],
            [0, 2],
            [1, 2],
          ],
          1,
        ],
        expected: 4,
      },
      {
        args: [[], [], 2],
        expected: 0,
      },
      {
        args: [
          [-3, 1, 2],
          [
            [0, 2],
            [0, 1],
            [0, 2],
          ],
          2,
        ],
        expected: 0,
      },
      {
        args: [
          [3, 2, 0, 0],
          [
            [2, 3],
            [2, 2],
            [0, 2],
          ],
          -4,
        ],
        expected: 3,
      },
      {
        args: [
          [3],
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          -3,
        ],
        expected: 3,
      },
      {
        args: [
          [3, -3, -2, 2],
          [
            [0, 1],
            [2, 3],
            [0, 1],
          ],
          3,
        ],
        expected: 0,
      },
      {
        args: [
          [-1, -1],
          [
            [0, 0],
            [0, 0],
            [1, 1],
          ],
          -3,
        ],
        expected: 3,
      },
      {
        args: [
          [3, -2, 3, 0, 3],
          [
            [0, 2],
            [1, 1],
            [4, 4],
          ],
          -4,
        ],
        expected: 3,
      },
      {
        args: [
          [3, -1, 0, 1, -1, -1],
          [
            [2, 5],
            [2, 5],
            [0, 2],
          ],
          3,
        ],
        expected: 0,
      },
      {
        args: [
          [-1, 1, -3, 3, 1],
          [
            [0, 2],
            [2, 4],
            [2, 3],
          ],
          1,
        ],
        expected: 1,
      },
      {
        args: [
          [0, -2, -2, -2, 2, -1],
          [
            [0, 2],
            [3, 4],
            [2, 5],
          ],
          -1,
        ],
        expected: 1,
      },
      {
        args: [
          [0, -3, -1],
          [
            [0, 2],
            [2, 2],
            [0, 1],
          ],
          -3,
        ],
        expected: 2,
      },
    ],
    6: [
      {
        args: [[-3, 0, 2, 2], 4],
        expected: false,
      },
      {
        args: [[-2, -1, 0, 1, 2, 2], -1],
        expected: true,
      },
      {
        args: [[-3, 3], 3],
        expected: true,
      },
      {
        args: [[-2, -2, 0, 1, 1, 1], 1],
        expected: true,
      },
      {
        args: [[-2, -1, 1, 1, 3], -1],
        expected: true,
      },
      {
        args: [[-3, -2, -2], -2],
        expected: true,
      },
      {
        args: [[-3, 0], -1],
        expected: false,
      },
      {
        args: [[-3, -2, 1, 3], -2],
        expected: true,
      },
      {
        args: [[-2, 0, 2, 3], 3],
        expected: true,
      },
      {
        args: [[-3, 0, 1, 1, 2], 0],
        expected: true,
      },
      {
        args: [[2], 3],
        expected: false,
      },
      {
        args: [[0, 3], -2],
        expected: false,
      },
    ],
    7: [
      {
        args: [[-3, 0, -2, 1, -2, 3]],
        expected: [3, 1, 0, -2, -2, -3],
      },
      {
        args: [[2, 1, 2]],
        expected: [2, 2, 1],
      },
      {
        args: [[-2, 0, -2]],
        expected: [0, -2, -2],
      },
      {
        args: [[1, 1, -2, 1, -3]],
        expected: [1, 1, 1, -2, -3],
      },
      {
        args: [[0, -3, 1, 0, 0]],
        expected: [1, 0, 0, 0, -3],
      },
      {
        args: [[3, -1, 1]],
        expected: [3, 1, -1],
      },
      {
        args: [[0, 2, -1, 3, 3]],
        expected: [3, 3, 2, 0, -1],
      },
      {
        args: [[3, 1, 1]],
        expected: [3, 1, 1],
      },
      {
        args: [[-3]],
        expected: [-3],
      },
      {
        args: [[2, 2]],
        expected: [2, 2],
      },
      {
        args: [[-2, 0, 1, 2]],
        expected: [2, 1, 0, -2],
      },
      {
        args: [[1, 3]],
        expected: [3, 1],
      },
    ],
    8: [
      {
        args: [[], []],
        expected: [],
      },
      {
        args: [[1], []],
        expected: [1],
      },
      {
        args: [[], [1]],
        expected: [1],
      },
      {
        args: [
          [1, 1],
          [1, 1, 1],
        ],
        expected: [1],
      },
      {
        args: [
          [1, 2, 5, 8],
          [2, 8],
        ],
        expected: [1, 2, 5, 8],
      },
      {
        args: [[1], [2, 3, 4]],
        expected: [1, 2, 3, 4],
      },
      {
        args: [
          [-3, -1],
          [-4, -3, -1, 0],
        ],
        expected: [-4, -3, -1, 0],
      },
      {
        args: [
          [-3, -3, -2, -1, 1, 1],
          [-3, -1, 1, 4],
        ],
        expected: [-3, -2, -1, 1, 4],
      },
      {
        args: [
          [0, 0, 0, 3],
          [0, 3, 3],
        ],
        expected: [0, 3],
      },
      {
        args: [
          [-3, -3, 0, 3],
          [-3, 0, 3],
        ],
        expected: [-3, 0, 3],
      },
      {
        args: [
          [-2, 0, 1],
          [0, 1, 1],
        ],
        expected: [-2, 0, 1],
      },
      {
        args: [[-2], [-4, -2]],
        expected: [-4, -2],
      },
    ],
    9: [
      {
        args: ["]}(}{}"],
        expected: false,
      },
      {
        args: ["(}[)({)"],
        expected: false,
      },
      {
        args: [")}{"],
        expected: false,
      },
      {
        args: ["()(}"],
        expected: false,
      },
      {
        args: ["["],
        expected: false,
      },
      {
        args: ["{"],
        expected: false,
      },
      {
        args: ["))})("],
        expected: false,
      },
      {
        args: ["[[]]))])]"],
        expected: false,
      },
      {
        args: ["(}[({{}[}"],
        expected: false,
      },
      {
        args: ["{}"],
        expected: true,
      },
      {
        args: ["[("],
        expected: false,
      },
      {
        args: ["{])][("],
        expected: false,
      },
    ],
    10: [
      {
        args: [[["add", 3], ["take"], ["take"], ["add", 4], ["take"], ["take"], ["take"], ["take"]], 4],
        expected: [3, null, 4, null, null, null],
      },
      {
        args: [[["add", 0], ["take"], ["take"], ["take"], ["add", 0], ["take"], ["take"], ["add", 2]], 4],
        expected: [0, null, null, 0, null],
      },
      {
        args: [[["add", 1], ["add", 2], ["add", 3], ["take"], ["add", 3], ["add", 3], ["take"], ["take"]], 1],
        expected: [1, 3, null],
      },
      {
        args: [[["add", 3], ["take"], ["take"], ["take"], ["take"], ["add", 1], ["take"], ["take"]], 1],
        expected: [3, null, null, null, 1, null],
      },
      {
        args: [[["add", 0], ["take"], ["take"], ["take"], ["add", 0], ["take"], ["take"], ["add", 4]], 0],
        expected: [null, null, null, null, null],
      },
      {
        args: [[["take"], ["add", 1], ["add", 0], ["take"], ["add", 2], ["add", 0], ["add", 3], ["add", 4]], 3],
        expected: [null, 1],
      },
      {
        args: [[["take"], ["take"], ["take"], ["add", 1], ["take"], ["take"], ["take"], ["add", 4]], 0],
        expected: [null, null, null, null, null, null],
      },
      {
        args: [[["take"], ["take"], ["add", 2], ["take"], ["take"], ["take"], ["add", 4], ["take"]], 3],
        expected: [null, null, 2, null, null, 4],
      },
      {
        args: [[["add", 1], ["add", 2], ["add", 2], ["take"], ["take"], ["add", 1], ["take"], ["take"]], 0],
        expected: [null, null, null, null],
      },
      {
        args: [[["add", 0], ["take"], ["add", 4], ["take"], ["take"], ["take"], ["add", 4], ["add", 0]], 4],
        expected: [0, 4, null, null],
      },
      {
        args: [[["add", 4], ["add", 0], ["add", 3], ["add", 3], ["add", 0], ["take"], ["take"], ["take"]], 0],
        expected: [null, null, null],
      },
      {
        args: [[["add", 1], ["add", 3], ["take"], ["take"], ["take"], ["take"], ["add", 3], ["take"]], 3],
        expected: [1, 3, null, null, 3],
      },
    ],
    11: [
      {
        args: [
          {
            value: 3,
            next: {
              value: 0,
              next: {
                value: -3,
                next: {
                  value: 3,
                  next: {
                    value: -2,
                    next: null,
                  },
                },
              },
            },
          },
          4,
        ],
        expected: -2,
      },
      {
        args: [
          {
            value: -2,
            next: {
              value: 3,
              next: null,
            },
          },
          5,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 3,
            next: {
              value: 1,
              next: null,
            },
          },
          7,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: 0,
              next: {
                value: 0,
                next: {
                  value: 1,
                  next: null,
                },
              },
            },
          },
          4,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 3,
            next: {
              value: -2,
              next: {
                value: 0,
                next: {
                  value: -1,
                  next: {
                    value: 1,
                    next: null,
                  },
                },
              },
            },
          },
          1,
        ],
        expected: -2,
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: 3,
              next: {
                value: -1,
                next: {
                  value: 2,
                  next: null,
                },
              },
            },
          },
          5,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -2,
            next: {
              value: -3,
              next: {
                value: 0,
                next: {
                  value: -3,
                  next: null,
                },
              },
            },
          },
          0,
        ],
        expected: -2,
      },
      {
        args: [
          {
            value: -3,
            next: {
              value: -2,
              next: {
                value: -3,
                next: {
                  value: 2,
                  next: {
                    value: 3,
                    next: {
                      value: -1,
                      next: null,
                    },
                  },
                },
              },
            },
          },
          7,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -2,
            next: {
              value: 1,
              next: {
                value: -2,
                next: {
                  value: 2,
                  next: null,
                },
              },
            },
          },
          4,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 0,
            next: {
              value: 0,
              next: null,
            },
          },
          8,
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 0,
            next: {
              value: -1,
              next: null,
            },
          },
          1,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: -2,
            next: {
              value: 0,
              next: {
                value: 3,
                next: {
                  value: 1,
                  next: {
                    value: 1,
                    next: {
                      value: 1,
                      next: null,
                    },
                  },
                },
              },
            },
          },
          6,
        ],
        expected: null,
      },
    ],
    12: [
      {
        args: [["A", "ab", "b"]],
        expected: "A",
      },
      {
        args: [["", "a", "A"]],
        expected: "",
      },
      {
        args: [["ab", "", "A", "a"]],
        expected: "ab",
      },
      {
        args: [["a", "b", "a", "b", "", "ab"]],
        expected: "",
      },
      {
        args: [["", "a", "a", "", "A", "b"]],
        expected: "A",
      },
      {
        args: [["b", "a", "a", "a"]],
        expected: "b",
      },
      {
        args: [["A", "ab", "A"]],
        expected: "ab",
      },
      {
        args: [["A", "ab", "ab", "A"]],
        expected: null,
      },
      {
        args: [["", "ab", "A", ""]],
        expected: "ab",
      },
      {
        args: [["a", "A", "b", "a", "b"]],
        expected: "A",
      },
      {
        args: [["", "A", "", "ab"]],
        expected: "A",
      },
      {
        args: [["a", "b", "a"]],
        expected: "b",
      },
    ],
    13: [
      {
        args: [[1, -2, -1, -2, 0], -1],
        expected: true,
      },
      {
        args: [[-3], -4],
        expected: false,
      },
      {
        args: [[1, 1, 0], 2],
        expected: true,
      },
      {
        args: [[1, 2, -3, 3, 0], 1],
        expected: true,
      },
      {
        args: [[1], -1],
        expected: false,
      },
      {
        args: [[-3, -3], -3],
        expected: false,
      },
      {
        args: [[2, 0, 1, 3, 1], 4],
        expected: true,
      },
      {
        args: [[-1], 3],
        expected: false,
      },
      {
        args: [[1], -2],
        expected: false,
      },
      {
        args: [[2, -3], -3],
        expected: false,
      },
      {
        args: [[-1, -1, 2], 3],
        expected: false,
      },
      {
        args: [[3, -1, 1], 0],
        expected: true,
      },
    ],
    14: [
      {
        args: [-1, 0],
        expected: 1,
      },
      {
        args: [2, 0],
        expected: 1,
      },
      {
        args: [0, 4],
        expected: 0,
      },
      {
        args: [-3, 3],
        expected: -27,
      },
      {
        args: [-2, 2],
        expected: 4,
      },
      {
        args: [1, 6],
        expected: 1,
      },
      {
        args: [1, 2],
        expected: 1,
      },
      {
        args: [3, 5],
        expected: 243,
      },
      {
        args: [0, 3],
        expected: 0,
      },
      {
        args: [2, 3],
        expected: 8,
      },
      {
        args: [2, 5],
        expected: 32,
      },
      {
        args: [4, 3],
        expected: 64,
      },
    ],
    15: [
      {
        args: [
          {
            value: -2,
            left: null,
            right: null,
          },
        ],
        expected: [-2],
      },
      {
        args: [
          {
            value: 6,
            left: {
              value: 1,
              left: {
                value: -7,
                left: null,
                right: {
                  value: 0,
                  left: null,
                  right: null,
                },
              },
              right: {
                value: 4,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: [6, 1, -7, 0, 4],
      },
      {
        args: [
          {
            value: 8,
            left: null,
            right: null,
          },
        ],
        expected: [8],
      },
      {
        args: [
          {
            value: -3,
            left: null,
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        ],
        expected: [-3, 8],
      },
      {
        args: [
          {
            value: -5,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: [-5, -8],
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: 7,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: [8, 7],
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: {
              value: 2,
              left: null,
              right: {
                value: 5,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: [-3, -4, 2, 5],
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: 0,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: [8, 0],
      },
      {
        args: [
          {
            value: -4,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: {
              value: 6,
              left: {
                value: -3,
                left: null,
                right: null,
              },
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: [-4, -5, 6, -3, 7],
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: 0,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: {
                value: 4,
                left: {
                  value: 2,
                  left: null,
                  right: {
                    value: 3,
                    left: null,
                    right: null,
                  },
                },
                right: null,
              },
            },
          },
        ],
        expected: [-6, 0, -4, 4, 2, 3],
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 0,
              left: {
                value: -1,
                left: {
                  value: -2,
                  left: {
                    value: -8,
                    left: null,
                    right: null,
                  },
                  right: null,
                },
                right: null,
              },
              right: {
                value: 2,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: [5, 0, -1, -2, -8, 2],
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: 3,
              left: {
                value: 2,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        ],
        expected: [4, 3, 2, 8],
      },
    ],
    16: [
      {
        args: [
          {
            value: -1,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: {
              value: 0,
              left: null,
              right: {
                value: 6,
                left: {
                  value: 5,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
          -3,
          1,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 3,
              left: null,
              right: null,
            },
            right: null,
          },
          -4,
          0,
        ],
        expected: 0,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: 1,
              left: {
                value: -3,
                left: null,
                right: {
                  value: 0,
                  left: null,
                  right: null,
                },
              },
              right: {
                value: 2,
                left: null,
                right: {
                  value: 7,
                  left: null,
                  right: null,
                },
              },
            },
          },
          2,
          6,
        ],
        expected: 2,
      },
      {
        args: [null, -3, 1],
        expected: 0,
      },
      {
        args: [null, -1, 3],
        expected: 0,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: 2,
              left: {
                value: -5,
                left: {
                  value: -6,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: null,
          },
          3,
          7,
        ],
        expected: 4,
      },
      {
        args: [
          {
            value: -5,
            left: {
              value: -6,
              left: null,
              right: null,
            },
            right: {
              value: 5,
              left: {
                value: 3,
                left: {
                  value: -1,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
          },
          4,
          8,
        ],
        expected: 5,
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -4,
              left: {
                value: -5,
                left: {
                  value: -8,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: {
              value: 0,
              left: null,
              right: {
                value: 1,
                left: null,
                right: null,
              },
            },
          },
          1,
          5,
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: 4,
              left: {
                value: 0,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          3,
          7,
        ],
        expected: 4,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -3,
              left: null,
              right: null,
            },
            right: {
              value: 1,
              left: null,
              right: null,
            },
          },
          -1,
          3,
        ],
        expected: 0,
      },
      {
        args: [
          {
            value: -5,
            left: null,
            right: {
              value: -1,
              left: null,
              right: {
                value: 3,
                left: null,
                right: null,
              },
            },
          },
          -2,
          2,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: -1,
            left: null,
            right: {
              value: 7,
              left: {
                value: 4,
                left: {
                  value: 0,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
          },
          -1,
          3,
        ],
        expected: -1,
      },
    ],
    17: [
      {
        args: [[1, 3, -2, 0, -2, -3], 2],
        expected: [3, 1],
      },
      {
        args: [[-1, -3, -1], 0],
        expected: [],
      },
      {
        args: [[0], 1],
        expected: [0],
      },
      {
        args: [[0, 3, 2], 1],
        expected: [3],
      },
      {
        args: [[1, 3, -1, 1, 2, 0], 4],
        expected: [3, 2, 1, 1],
      },
      {
        args: [[3, 0, -2], 0],
        expected: [],
      },
      {
        args: [[-3, -1, -2, 0], 1],
        expected: [0],
      },
      {
        args: [[2, 0, 0, -1, -2], 2],
        expected: [2, 0],
      },
      {
        args: [[], 0],
        expected: [],
      },
      {
        args: [[3, -1, 3, 3], 1],
        expected: [3],
      },
      {
        args: [[-3, -3], 1],
        expected: [-3],
      },
      {
        args: [[3, -2, -3, -2], 2],
        expected: [3, -2],
      },
    ],
    18: [
      {
        args: [{}, "A"],
        expected: {
          A: 0,
        },
      },
      {
        args: [
          {
            A: ["B"],
            B: ["A"],
          },
          "A",
        ],
        expected: {
          A: 0,
          B: 1,
        },
      },
      {
        args: [
          {
            A: ["D", "C", "B", "A"],
          },
          "D",
        ],
        expected: {
          D: 0,
        },
      },
      {
        args: [
          {
            A: ["C", "D"],
            B: ["D", "A", "B"],
            C: ["D", "B", "C"],
          },
          "D",
        ],
        expected: {
          D: 0,
        },
      },
      {
        args: [
          {
            A: ["D"],
          },
          "C",
        ],
        expected: {
          C: 0,
        },
      },
      {
        args: [
          {
            A: ["A", "B", "D"],
            B: ["D", "C", "B", "A"],
            C: ["A", "B", "C"],
          },
          "B",
        ],
        expected: {
          A: 1,
          B: 0,
          C: 1,
          D: 1,
        },
      },
      {
        args: [
          {
            A: ["C"],
          },
          "B",
        ],
        expected: {
          B: 0,
        },
      },
      {
        args: [{}, "B"],
        expected: {
          B: 0,
        },
      },
      {
        args: [
          {
            A: ["D", "A", "C", "B"],
            B: ["A"],
          },
          "B",
        ],
        expected: {
          A: 1,
          B: 0,
          C: 2,
          D: 2,
        },
      },
      {
        args: [{}, "D"],
        expected: {
          D: 0,
        },
      },
      {
        args: [
          {
            A: [],
            B: ["B"],
            C: ["C"],
            D: [],
          },
          "D",
        ],
        expected: {
          D: 0,
        },
      },
      {
        args: [
          {
            A: ["C", "D", "A", "B"],
          },
          "D",
        ],
        expected: {
          D: 0,
        },
      },
    ],
    19: [
      {
        args: [
          4,
          [
            [1, 1],
            [3, 1],
            [3, 0],
            [0, 2],
            [1, 2],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [2, 2],
            [2, 0],
            [3, 0],
            [2, 2],
            [0, 1],
            [3, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [3, 1],
            [1, 3],
            [1, 0],
            [0, 3],
            [2, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          2,
          [
            [1, 1],
            [1, 0],
            [1, 1],
            [1, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [0, 3],
            [0, 2],
            [2, 2],
            [0, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [1, 1],
            [1, 3],
            [2, 3],
            [2, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          3,
          [
            [1, 0],
            [1, 1],
            [2, 1],
            [0, 0],
            [2, 1],
            [1, 2],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [1, 0],
            [1, 2],
            [1, 2],
            [2, 3],
            [3, 2],
            [3, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          2,
          [
            [1, 1],
            [1, 1],
            [0, 1],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          3,
          [
            [2, 2],
            [0, 1],
            [2, 1],
            [1, 0],
            [2, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [2, 3],
            [1, 3],
            [3, 2],
            [2, 2],
            [0, 3],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [1, 2],
            [0, 1],
          ],
        ],
        expected: 1,
      },
    ],
    20: [
      {
        args: [
          [
            [1, 2],
            [2, 3],
            [1, 10],
          ],
        ],
        expected: 1,
      },
      {
        args: [[[-1, 2]]],
        expected: 0,
      },
      {
        args: [
          [
            [-4, 2],
            [-4, 1],
            [0, 3],
            [0, 3],
            [0, 3],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          [
            [-4, 2],
            [-3, 5],
            [-3, -2],
            [-3, 5],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [
            [1, 5],
            [-3, -2],
            [-2, 3],
            [-2, 5],
            [-1, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [2, 5],
            [-4, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          [
            [2, 4],
            [-4, 2],
            [3, 4],
            [-4, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [-4, -1],
            [2, 3],
            [-2, 5],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [-2, 0],
            [-4, -2],
            [-1, 4],
            [-4, 4],
            [-4, 5],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [
            [-2, 5],
            [-4, -3],
            [-4, -2],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [1, 3],
            [-4, -3],
            [-2, 3],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [3, 5],
            [2, 3],
            [-3, -2],
          ],
        ],
        expected: 0,
      },
    ],
    21: [
      {
        args: [25],
        expected: 2555757,
      },
      {
        args: [14],
        expected: 3136,
      },
      {
        args: [5],
        expected: 13,
      },
      {
        args: [7],
        expected: 44,
      },
      {
        args: [2],
        expected: 2,
      },
      {
        args: [12],
        expected: 927,
      },
      {
        args: [15],
        expected: 5768,
      },
      {
        args: [11],
        expected: 504,
      },
      {
        args: [8],
        expected: 81,
      },
      {
        args: [6],
        expected: 24,
      },
      {
        args: [9],
        expected: 149,
      },
      {
        args: [10],
        expected: 274,
      },
    ],
    22: [
      {
        args: [[1, 2], 3],
        expected: 2,
      },
      {
        args: [[], 3],
        expected: 0,
      },
      {
        args: [[2], 3],
        expected: 0,
      },
      {
        args: [[3, 4], 7],
        expected: 1,
      },
      {
        args: [[3, 4], 9],
        expected: 1,
      },
      {
        args: [[], 11],
        expected: 0,
      },
      {
        args: [[4, 1, 3], 5],
        expected: 3,
      },
      {
        args: [[4, 1, 2, 3], 2],
        expected: 2,
      },
      {
        args: [[1, 4, 3, 2], 5],
        expected: 6,
      },
      {
        args: [[2], 1],
        expected: 0,
      },
      {
        args: [[3, 2], 0],
        expected: 1,
      },
      {
        args: [[3, 2, 4], 11],
        expected: 4,
      },
    ],
    23: [
      {
        args: [{}, "A", "A", ["A"]],
        expected: [],
      },
      {
        args: [
          {
            A: [],
            B: ["C", "D", "B"],
          },
          "B",
          "A",
          ["C"],
        ],
        expected: [],
      },
      {
        args: [
          {
            A: ["C", "B"],
            B: ["A"],
          },
          "C",
          "C",
          [],
        ],
        expected: ["C"],
      },
      {
        args: [
          {
            A: ["C", "D"],
            B: [],
            C: [],
          },
          "D",
          "C",
          ["D"],
        ],
        expected: [],
      },
      {
        args: [
          {
            A: ["A", "D", "B", "C"],
            B: ["B", "C", "D"],
            C: [],
          },
          "A",
          "D",
          ["D", "B", "C"],
        ],
        expected: [],
      },
      {
        args: [
          {
            A: ["D", "A", "C"],
            B: [],
          },
          "C",
          "B",
          ["D", "B", "A", "C"],
        ],
        expected: [],
      },
      {
        args: [
          {
            A: [],
            B: ["C", "B", "A", "D"],
            C: [],
            D: [],
          },
          "B",
          "B",
          ["B"],
        ],
        expected: [],
      },
      {
        args: [
          {
            A: [],
            B: ["C", "D", "B", "A"],
            C: ["D", "C", "A"],
            D: ["C", "A"],
          },
          "C",
          "A",
          ["C", "A", "D", "B"],
        ],
        expected: [],
      },
      {
        args: [{}, "C", "C", []],
        expected: ["C"],
      },
      {
        args: [
          {
            A: ["A", "B"],
            B: ["B", "C"],
          },
          "A",
          "B",
          ["A"],
        ],
        expected: [],
      },
      {
        args: [
          {
            A: ["B"],
            B: ["C", "A"],
          },
          "D",
          "A",
          ["D", "A", "B"],
        ],
        expected: [],
      },
      {
        args: [
          {
            A: ["B", "A", "C", "D"],
            B: ["A", "D", "B", "C"],
            C: ["D", "B"],
            D: ["C", "B", "D", "A"],
          },
          "C",
          "D",
          [],
        ],
        expected: ["C", "D"],
      },
    ],
    24: [
      {
        args: [[-1, -3, 1, 0, 1]],
        expected: 2,
      },
      {
        args: [[-1, 1, 2, 3, -1]],
        expected: 3,
      },
      {
        args: [[-2, 3, 1, 3]],
        expected: 1,
      },
      {
        args: [[1, 2, 0, 1]],
        expected: 3,
      },
      {
        args: [[0, -3]],
        expected: 1,
      },
      {
        args: [[-1, -1, 2, 3, 2]],
        expected: 1,
      },
      {
        args: [[0]],
        expected: 0,
      },
      {
        args: [[3, -3, 1, 0, 2, 2]],
        expected: 6,
      },
      {
        args: [[3, -3, -3]],
        expected: 2,
      },
      {
        args: [[-3, -1, -3, 2, -1]],
        expected: 2,
      },
      {
        args: [[2, 2, 1, -1, 3]],
        expected: 5,
      },
      {
        args: [[3]],
        expected: 0,
      },
    ],
    25: [
      {
        args: [[2, 1, -1], 0],
        expected: -1,
      },
      {
        args: [[-3, 3], 0],
        expected: -3,
      },
      {
        args: [[-3, 2, -3, 3, 0], 2],
        expected: 0,
      },
      {
        args: [[-3, 2], 0],
        expected: -3,
      },
      {
        args: [[-1, 2], 0],
        expected: -1,
      },
      {
        args: [[-2, 1, 1, 1, 0], 1],
        expected: 0,
      },
      {
        args: [[2, -1, -3, -3], 0],
        expected: -3,
      },
      {
        args: [[-1, -3, 1, 2, 1], 0],
        expected: -3,
      },
      {
        args: [[-1, -3, -2, 1, -1], 0],
        expected: -3,
      },
      {
        args: [[-1, 3, 2, -2, 1], 4],
        expected: 3,
      },
      {
        args: [[-1], 0],
        expected: -1,
      },
      {
        args: [[3, 1, 3, -1, 0, -1], 1],
        expected: -1,
      },
    ],
    26: [
      {
        args: [[1, 2, 0, -3], 7],
        expected: [],
      },
      {
        args: [[0, -2, 3, -3], 1],
        expected: [[-3], [-2], [0], [3]],
      },
      {
        args: [[2, 3, -2], 1],
        expected: [[-2], [2], [3]],
      },
      {
        args: [[3, 2, 1, -3], 7],
        expected: [],
      },
      {
        args: [[3, -1], 1],
        expected: [[-1], [3]],
      },
      {
        args: [[3, 1, 0, -2], 2],
        expected: [
          [-2, 0],
          [-2, 1],
          [-2, 3],
          [0, 1],
          [0, 3],
          [1, 3],
        ],
      },
      {
        args: [[-1], 4],
        expected: [],
      },
      {
        args: [[3], 2],
        expected: [],
      },
      {
        args: [[-2, -1, 2, 3], 6],
        expected: [],
      },
      {
        args: [[], 1],
        expected: [],
      },
      {
        args: [[], 2],
        expected: [],
      },
      {
        args: [[1, 2, -2, -1, 3], 0],
        expected: [[]],
      },
    ],
    27: [
      {
        args: [[], ["", "a"]],
        expected: [false, false],
      },
      {
        args: [["car"], ["ca", "car", "cart"]],
        expected: [false, true, false],
      },
      {
        args: [
          ["", "a"],
          ["a", "z", "a"],
        ],
        expected: [true, false, true],
      },
      {
        args: [["a"], ["z", "", ""]],
        expected: [false, false, false],
      },
      {
        args: [
          ["ab", "a", "a", "ab", "ab"],
          ["", "z", "a"],
        ],
        expected: [false, false, true],
      },
      {
        args: [
          ["", "ab", "", "a"],
          ["a", "z", ""],
        ],
        expected: [true, false, true],
      },
      {
        args: [[], ["z", "", "z"]],
        expected: [false, false, false],
      },
      {
        args: [
          ["ab", "", "b", "a"],
          ["a", "a", "z"],
        ],
        expected: [true, true, false],
      },
      {
        args: [[], ["z", "", ""]],
        expected: [false, false, false],
      },
      {
        args: [
          ["ab", "a", "ab", "a"],
          ["ab", "", "ab"],
        ],
        expected: [true, false, true],
      },
      {
        args: [
          ["", "a"],
          ["z", "", "z"],
        ],
        expected: [false, true, false],
      },
      {
        args: [["a"], ["z", "ab", "z"]],
        expected: [false, false, false],
      },
    ],
    28: [
      {
        args: [
          3,
          [[0, 1]],
          [
            [0, 0],
            [0, 1],
            [0, 2],
          ],
        ],
        expected: [true, true, false],
      },
      {
        args: [
          4,
          [
            [0, 2],
            [2, 3],
          ],
          [
            [3, 3],
            [3, 0],
            [3, 1],
          ],
        ],
        expected: [true, true, false],
      },
      {
        args: [
          3,
          [
            [1, 0],
            [2, 1],
            [0, 2],
          ],
          [
            [2, 2],
            [1, 1],
            [2, 1],
          ],
        ],
        expected: [true, true, true],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [true, true, true],
      },
      {
        args: [
          3,
          [
            [2, 2],
            [1, 2],
          ],
          [
            [1, 0],
            [0, 0],
            [2, 0],
          ],
        ],
        expected: [false, true, false],
      },
      {
        args: [
          4,
          [
            [0, 0],
            [1, 3],
            [0, 3],
            [2, 1],
            [1, 1],
          ],
          [
            [2, 3],
            [2, 3],
            [0, 0],
          ],
        ],
        expected: [true, true, true],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [true, true, true],
      },
      {
        args: [
          4,
          [[3, 1]],
          [
            [3, 1],
            [3, 3],
            [3, 3],
          ],
        ],
        expected: [true, true, true],
      },
      {
        args: [
          2,
          [],
          [
            [0, 1],
            [0, 0],
            [1, 1],
          ],
        ],
        expected: [false, true, true],
      },
      {
        args: [
          3,
          [
            [0, 0],
            [0, 2],
            [0, 2],
            [1, 2],
            [2, 0],
          ],
          [
            [1, 0],
            [1, 2],
            [0, 0],
          ],
        ],
        expected: [true, true, true],
      },
      {
        args: [
          2,
          [
            [0, 1],
            [1, 0],
          ],
          [
            [1, 0],
            [0, 1],
            [1, 0],
          ],
        ],
        expected: [true, true, true],
      },
      {
        args: [
          2,
          [
            [0, 1],
            [1, 1],
            [0, 0],
            [1, 1],
            [1, 1],
          ],
          [
            [0, 0],
            [0, 1],
            [0, 0],
          ],
        ],
        expected: [true, true, true],
      },
    ],
    29: [
      {
        args: [
          3,
          [
            [0, 0],
            [0, 0],
            [0, 2],
            [0, 2],
            [0, 2],
            [1, 2],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [2, 0],
            [1, 2],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          3,
          [
            [2, 1],
            [0, 1],
            [1, 2],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          4,
          [
            [3, 2],
            [3, 1],
            [0, 0],
            [3, 0],
            [0, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 1],
            [1, 0],
            [0, 1],
            [0, 1],
            [1, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [3, 0],
            [3, 0],
            [2, 0],
            [0, 1],
            [3, 3],
            [2, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [0, 2],
            [0, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [3, []],
        expected: -1,
      },
      {
        args: [2, []],
        expected: -1,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [2, 2],
          ],
        ],
        expected: 1,
      },
    ],
    30: [
      {
        args: [{}, "A"],
        expected: {
          A: 0,
        },
      },
      {
        args: [
          {
            A: [
              ["B", 8],
              ["C", 1],
            ],
            C: [["B", 1]],
          },
          "A",
        ],
        expected: {
          A: 0,
          B: 2,
          C: 1,
        },
      },
      {
        args: [
          {
            A: [
              ["B", 3],
              ["C", 0],
              ["D", 0],
            ],
            B: [],
          },
          "B",
        ],
        expected: {
          B: 0,
        },
      },
      {
        args: [
          {
            A: [
              ["C", 4],
              ["B", 1],
              ["D", 3],
              ["A", 2],
            ],
            B: [
              ["D", 1],
              ["B", 3],
            ],
            C: [
              ["A", 2],
              ["B", 0],
            ],
          },
          "D",
        ],
        expected: {
          D: 0,
        },
      },
      {
        args: [
          {
            A: [
              ["B", 5],
              ["C", 2],
              ["A", 4],
            ],
            B: [
              ["B", 2],
              ["D", 4],
              ["A", 1],
            ],
            C: [
              ["B", 2],
              ["D", 0],
              ["A", 3],
              ["C", 0],
            ],
            D: [
              ["B", 5],
              ["C", 1],
            ],
          },
          "A",
        ],
        expected: {
          A: 0,
          B: 4,
          C: 2,
          D: 2,
        },
      },
      {
        args: [
          {
            A: [
              ["B", 1],
              ["C", 5],
              ["D", 1],
              ["A", 0],
            ],
          },
          "D",
        ],
        expected: {
          D: 0,
        },
      },
      {
        args: [
          {
            A: [
              ["B", 0],
              ["D", 1],
            ],
            B: [
              ["C", 5],
              ["B", 5],
            ],
            C: [
              ["C", 1],
              ["D", 1],
              ["B", 2],
            ],
            D: [
              ["D", 5],
              ["A", 2],
            ],
          },
          "D",
        ],
        expected: {
          A: 2,
          B: 2,
          C: 7,
          D: 0,
        },
      },
      {
        args: [{}, "D"],
        expected: {
          D: 0,
        },
      },
      {
        args: [
          {
            A: [
              ["C", 1],
              ["A", 1],
              ["B", 4],
              ["D", 4],
            ],
            B: [
              ["A", 5],
              ["C", 5],
            ],
            C: [
              ["D", 0],
              ["A", 2],
            ],
            D: [
              ["C", 1],
              ["D", 3],
              ["B", 1],
              ["A", 4],
            ],
          },
          "C",
        ],
        expected: {
          A: 2,
          B: 1,
          C: 0,
          D: 0,
        },
      },
      {
        args: [{}, "B"],
        expected: {
          B: 0,
        },
      },
      {
        args: [
          {
            A: [
              ["B", 0],
              ["A", 5],
              ["C", 3],
            ],
            B: [
              ["D", 4],
              ["C", 0],
              ["A", 4],
            ],
            C: [["B", 0]],
            D: [
              ["A", 3],
              ["C", 5],
            ],
          },
          "A",
        ],
        expected: {
          A: 0,
          B: 0,
          C: 0,
          D: 4,
        },
      },
      {
        args: [{}, "C"],
        expected: {
          C: 0,
        },
      },
    ],
    31: [
      {
        args: [
          2,
          [
            [0, 0],
            [0, 1],
            [0, 1],
            [1, 0],
            [1, 1],
          ],
        ],
        expected: -1,
      },
      {
        args: [4, []],
        expected: 1,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [1, 2],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          3,
          [
            [0, 2],
            [2, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          2,
          [
            [0, 1],
            [0, 0],
            [0, 0],
            [1, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [1, []],
        expected: 1,
      },
      {
        args: [
          3,
          [
            [0, 2],
            [1, 0],
            [2, 1],
            [0, 1],
            [1, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [3, [[1, 0]]],
        expected: 2,
      },
      {
        args: [3, [[1, 2]]],
        expected: 2,
      },
    ],
    32: [
      {
        args: [
          4,
          [
            [0, 1, 2],
            [2, 3, 3],
          ],
        ],
        expected: 5,
      },
      {
        args: [
          4,
          [
            [0, 2, 3],
            [2, 3, 1],
            [3, 2, 0],
            [1, 2, 3],
            [0, 0, 5],
          ],
        ],
        expected: 6,
      },
      {
        args: [
          2,
          [
            [0, 1, -3],
            [1, 1, -3],
            [1, 1, 0],
            [1, 0, 2],
          ],
        ],
        expected: -3,
      },
      {
        args: [
          4,
          [
            [3, 0, -3],
            [1, 2, -2],
          ],
        ],
        expected: -5,
      },
      {
        args: [
          1,
          [
            [0, 0, 5],
            [0, 0, -2],
            [0, 0, 1],
            [0, 0, 2],
            [0, 0, 0],
            [0, 0, -3],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [1, 0, -2],
            [1, 1, 2],
            [1, 1, 4],
            [1, 1, -3],
            [0, 1, -2],
          ],
        ],
        expected: -2,
      },
      {
        args: [0, []],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [2, 2, 5],
            [2, 0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          1,
          [
            [0, 0, 5],
            [0, 0, -2],
            [0, 0, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [0, 0, 3],
            [2, 1, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [1, 1, -3],
            [0, 0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [0, 2, 5],
            [2, 1, -3],
            [1, 1, -1],
            [0, 0, 5],
            [0, 1, 3],
            [2, 0, 2],
          ],
        ],
        expected: -1,
      },
    ],
    33: [
      {
        args: ["AAA", "bb"],
        expected: 3,
      },
      {
        args: ["aa", "aa"],
        expected: 0,
      },
      {
        args: ["AaAaa", "a"],
        expected: 4,
      },
      {
        args: ["a", "A"],
        expected: 1,
      },
      {
        args: ["ab", "b"],
        expected: 1,
      },
      {
        args: ["AAbaa", "AA"],
        expected: 3,
      },
      {
        args: ["AA", "Aa"],
        expected: 1,
      },
      {
        args: ["aaAb", ""],
        expected: 4,
      },
      {
        args: ["bAbAA", ""],
        expected: 5,
      },
      {
        args: ["bAb", ""],
        expected: 3,
      },
      {
        args: ["", "bbabA"],
        expected: 5,
      },
      {
        args: ["Ab", "Ab"],
        expected: 0,
      },
    ],
    34: [
      {
        args: [[-3, 3, 3, 0, -3, 1]],
        expected: 3,
      },
      {
        args: [[0, 2, -1]],
        expected: 2,
      },
      {
        args: [[-2, 2, -3, -2]],
        expected: 2,
      },
      {
        args: [[0]],
        expected: 1,
      },
      {
        args: [[1, -2, 3, 2, 0]],
        expected: 3,
      },
      {
        args: [[3, 3, 2, 1]],
        expected: 3,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[0, 2]],
        expected: 1,
      },
      {
        args: [[0, 1, 1, 3, 3]],
        expected: 1,
      },
      {
        args: [[3, -2, 3]],
        expected: 2,
      },
      {
        args: [[-3, 0, -2, -2, 1, 0]],
        expected: 2,
      },
      {
        args: [[-1, -1, 3, -2, -2]],
        expected: 2,
      },
    ],
    35: [
      {
        args: [[2, 2], 4],
        expected: true,
      },
      {
        args: [[], 7],
        expected: false,
      },
      {
        args: [[5], 7],
        expected: false,
      },
      {
        args: [[4], 4],
        expected: true,
      },
      {
        args: [[1, 7, 5], 5],
        expected: true,
      },
      {
        args: [[], 2],
        expected: false,
      },
      {
        args: [[7, 6, 4], 3],
        expected: false,
      },
      {
        args: [[1], 0],
        expected: true,
      },
      {
        args: [[3, 7, 6, 2, 2, 5], 4],
        expected: true,
      },
      {
        args: [[6, 6, 5, 7, 3], 1],
        expected: false,
      },
      {
        args: [[5, 2, 7], 0],
        expected: true,
      },
      {
        args: [[2, 7, 4, 2], 5],
        expected: false,
      },
    ],
    36: [
      {
        args: [[-3, 0]],
        expected: [-6, 0],
      },
      {
        args: [[3, -2, 3, 1]],
        expected: [6, -4, 6, 2],
      },
      {
        args: [[3, 0, -2, -3, 3]],
        expected: [6, 0, -4, -6, 6],
      },
      {
        args: [[1, -2]],
        expected: [2, -4],
      },
      {
        args: [[-3, -2, 2]],
        expected: [-6, -4, 4],
      },
      {
        args: [[-1, 1, -1, 3]],
        expected: [-2, 2, -2, 6],
      },
      {
        args: [[0]],
        expected: [0],
      },
      {
        args: [[-2, 0, 0, -1, -2, 1]],
        expected: [-4, 0, 0, -2, -4, 2],
      },
      {
        args: [[-2, -2, 3]],
        expected: [-4, -4, 6],
      },
      {
        args: [[-1]],
        expected: [-2],
      },
      {
        args: [[2, 1, -2]],
        expected: [4, 2, -4],
      },
      {
        args: [[0, 1]],
        expected: [0, 2],
      },
    ],
    37: [
      {
        args: [[], []],
        expected: 0,
      },
      {
        args: [[1], []],
        expected: 0,
      },
      {
        args: [
          [1, 1],
          [1, 1, 1],
        ],
        expected: 1,
      },
      {
        args: [
          [1, 2, 5, 8],
          [2, 8],
        ],
        expected: 2,
      },
      {
        args: [[1], [2, 3, 4]],
        expected: 0,
      },
      {
        args: [
          [-3, -1],
          [-4, -3, -1, 0],
        ],
        expected: 2,
      },
      {
        args: [
          [0, -1, -1, -2, 2, 2],
          [0, 1, 1, 2, 2, 2],
        ],
        expected: 2,
      },
      {
        args: [
          [0, 1, -1, -2, 1],
          [0, 1, 1, 2, 1],
        ],
        expected: 2,
      },
      {
        args: [
          [-3, 2, -3, -1],
          [3, 2, 3, 1],
        ],
        expected: 1,
      },
      {
        args: [
          [-3, 1],
          [3, 1],
        ],
        expected: 1,
      },
      {
        args: [
          [-2, 0],
          [2, 0],
        ],
        expected: 1,
      },
      {
        args: [
          [2, -1, -3, 2, 2],
          [2, 1, 3, 2, 2],
        ],
        expected: 1,
      },
    ],
    38: [
      {
        args: [2],
        expected: 1,
      },
      {
        args: [31],
        expected: 31,
      },
      {
        args: [32],
        expected: 31,
      },
      {
        args: [33],
        expected: 63,
      },
      {
        args: [242],
        expected: 255,
      },
      {
        args: [248],
        expected: 255,
      },
      {
        args: [221],
        expected: 255,
      },
      {
        args: [120],
        expected: 127,
      },
      {
        args: [240],
        expected: 255,
      },
      {
        args: [247],
        expected: 255,
      },
      {
        args: [215],
        expected: 255,
      },
      {
        args: [107],
        expected: 127,
      },
    ],
    39: [
      {
        args: [7],
        expected: [7],
      },
      {
        args: [[[], [1, [], [2]], 3]],
        expected: [1, 2, 3],
      },
      {
        args: [[[2, -3], [[], []], 4]],
        expected: [2, -3, 4],
      },
      {
        args: [[[-1, 1], [[-2], []], -3]],
        expected: [-1, 1, -2, -3],
      },
      {
        args: [[[1, 1], [[1, 2, -1], []], 3]],
        expected: [1, 1, 1, 2, -1, 3],
      },
      {
        args: [[[-3, 3], [[-1, 1], []], 1]],
        expected: [-3, 3, -1, 1, 1],
      },
      {
        args: [[[2], [[], []], 2]],
        expected: [2, 2],
      },
      {
        args: [[[-1, -3], [[-3, 1, -1], []], -2]],
        expected: [-1, -3, -3, 1, -1, -2],
      },
      {
        args: [[[-3, -1], [[-1, -2], []], -2]],
        expected: [-3, -1, -1, -2, -2],
      },
      {
        args: [[[2, -1], [[], []], -1]],
        expected: [2, -1, -1],
      },
      {
        args: [[[], [[], []], -3]],
        expected: [-3],
      },
      {
        args: [[[], [[], []], 4]],
        expected: [4],
      },
    ],
    40: [
      {
        args: [
          3,
          [
            [0, 1],
            [0, 1],
            [1, 1],
          ],
        ],
        expected: [[1, 1], [0, 0, 1, 1], []],
      },
      {
        args: [4, []],
        expected: [[], [], [], []],
      },
      {
        args: [3, []],
        expected: [[], [], []],
      },
      {
        args: [
          2,
          [
            [1, 1],
            [1, 0],
            [0, 1],
          ],
        ],
        expected: [
          [1, 1],
          [1, 1, 0, 0],
        ],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
      },
      {
        args: [
          3,
          [
            [2, 2],
            [2, 1],
            [1, 1],
            [1, 2],
          ],
        ],
        expected: [[], [2, 1, 1, 2], [2, 2, 1, 1]],
      },
      {
        args: [
          2,
          [
            [1, 1],
            [0, 0],
            [0, 0],
            [1, 1],
          ],
        ],
        expected: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
        ],
      },
      {
        args: [
          3,
          [
            [0, 2],
            [1, 0],
            [1, 0],
            [2, 1],
          ],
        ],
        expected: [
          [2, 1, 1],
          [0, 0, 2],
          [0, 1],
        ],
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 0],
            [1, 1],
          ],
        ],
        expected: [
          [0, 0, 0, 0],
          [1, 1],
        ],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [[0, 0, 0, 0, 0, 0, 0, 0]],
      },
      {
        args: [2, [[0, 1]]],
        expected: [[1], [0]],
      },
      {
        args: [
          4,
          [
            [0, 3],
            [1, 2],
            [3, 0],
            [1, 0],
            [1, 0],
            [2, 0],
          ],
        ],
        expected: [
          [3, 3, 1, 1, 2],
          [2, 0, 0],
          [1, 0],
          [0, 0],
        ],
      },
    ],
    41: [
      {
        args: [[1, 4, 2]],
        expected: true,
      },
      {
        args: [[2, 1]],
        expected: false,
      },
      {
        args: [[1, 2]],
        expected: true,
      },
      {
        args: [[3, -3, -3]],
        expected: false,
      },
      {
        args: [[1, -2]],
        expected: false,
      },
      {
        args: [[2, 2, 0, -3, 2]],
        expected: false,
      },
      {
        args: [[0, 3, -3, 2, 2]],
        expected: false,
      },
      {
        args: [[-3]],
        expected: true,
      },
      {
        args: [[-1, 3, 2, -2]],
        expected: false,
      },
      {
        args: [[-3, 1, -1, -2, 0, -2]],
        expected: false,
      },
      {
        args: [[1, 1, -2, -3, 1, 1]],
        expected: false,
      },
      {
        args: [[1]],
        expected: true,
      },
    ],
    42: [
      {
        args: [[0, 0, 0], 0],
        expected: 3,
      },
      {
        args: [[1, 1, 1], 2],
        expected: 2,
      },
      {
        args: [[1, 1, 2, 1, 0, 0], 8],
        expected: 6,
      },
      {
        args: [[], 1],
        expected: 0,
      },
      {
        args: [[2], 7],
        expected: 1,
      },
      {
        args: [[0], 4],
        expected: 1,
      },
      {
        args: [[3, 2], 11],
        expected: 2,
      },
      {
        args: [[0, 3, 2, 0, 3, 1], 4],
        expected: 3,
      },
      {
        args: [[3], 9],
        expected: 1,
      },
      {
        args: [[3, 2, 2, 2, 3, 1], 8],
        expected: 4,
      },
      {
        args: [[2, 1, 3, 2, 2], 0],
        expected: 0,
      },
      {
        args: [[3, 1, 2, 3], 5],
        expected: 2,
      },
    ],
    43: [
      {
        args: ["AA", 1],
        expected: 2,
      },
      {
        args: ["b", 4],
        expected: 1,
      },
      {
        args: ["a", 2],
        expected: 1,
      },
      {
        args: ["AAAbA", 0],
        expected: 0,
      },
      {
        args: ["A", 1],
        expected: 1,
      },
      {
        args: ["", 4],
        expected: 0,
      },
      {
        args: ["ab", 2],
        expected: 2,
      },
      {
        args: ["baaabA", 4],
        expected: 6,
      },
      {
        args: ["bbAa", 4],
        expected: 4,
      },
      {
        args: ["aaAAAa", 0],
        expected: 0,
      },
      {
        args: ["A", 3],
        expected: 1,
      },
      {
        args: ["a", 1],
        expected: 1,
      },
    ],
    44: [
      {
        args: [
          {
            value: 3,
            next: {
              value: 1,
              next: {
                value: -2,
                next: null,
              },
            },
          },
          -1,
        ],
        expected: {
          value: 3,
          next: {
            value: 1,
            next: {
              value: -2,
              next: null,
            },
          },
        },
      },
      {
        args: [
          {
            value: 2,
            next: {
              value: 2,
              next: null,
            },
          },
          -2,
        ],
        expected: {
          value: 2,
          next: {
            value: 2,
            next: null,
          },
        },
      },
      {
        args: [
          {
            value: -1,
            next: {
              value: 1,
              next: null,
            },
          },
          0,
        ],
        expected: {
          value: -1,
          next: {
            value: 1,
            next: null,
          },
        },
      },
      {
        args: [
          {
            value: -1,
            next: {
              value: -2,
              next: null,
            },
          },
          -1,
        ],
        expected: {
          value: -2,
          next: null,
        },
      },
      {
        args: [null, 3],
        expected: null,
      },
      {
        args: [
          {
            value: 3,
            next: {
              value: 0,
              next: {
                value: -2,
                next: {
                  value: 0,
                  next: {
                    value: -2,
                    next: {
                      value: 2,
                      next: null,
                    },
                  },
                },
              },
            },
          },
          -2,
        ],
        expected: {
          value: 3,
          next: {
            value: 0,
            next: {
              value: 0,
              next: {
                value: 2,
                next: null,
              },
            },
          },
        },
      },
      {
        args: [
          {
            value: -3,
            next: {
              value: 2,
              next: {
                value: 2,
                next: {
                  value: -1,
                  next: null,
                },
              },
            },
          },
          3,
        ],
        expected: {
          value: -3,
          next: {
            value: 2,
            next: {
              value: 2,
              next: {
                value: -1,
                next: null,
              },
            },
          },
        },
      },
      {
        args: [null, 2],
        expected: null,
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: 2,
              next: null,
            },
          },
          -4,
        ],
        expected: {
          value: 1,
          next: {
            value: 2,
            next: null,
          },
        },
      },
      {
        args: [
          {
            value: -3,
            next: null,
          },
          0,
        ],
        expected: {
          value: -3,
          next: null,
        },
      },
      {
        args: [
          {
            value: 1,
            next: {
              value: 0,
              next: null,
            },
          },
          -4,
        ],
        expected: {
          value: 1,
          next: {
            value: 0,
            next: null,
          },
        },
      },
      {
        args: [
          {
            value: 3,
            next: null,
          },
          -4,
        ],
        expected: {
          value: 3,
          next: null,
        },
      },
    ],
    45: [
      {
        args: [[1, 2, 2, 2, 4], 2],
        expected: 3,
      },
      {
        args: [[1, 2], 3],
        expected: 0,
      },
      {
        args: [[-2, 1], 3],
        expected: 0,
      },
      {
        args: [[-1, 3], 3],
        expected: 1,
      },
      {
        args: [[-2, 0, 0, 1, 2, 2], -3],
        expected: 0,
      },
      {
        args: [[-2, 0, 1, 2, 2], 1],
        expected: 1,
      },
      {
        args: [[-3, -2, -1, 0, 1, 2], 0],
        expected: 1,
      },
      {
        args: [[-2, -1, 0, 2, 3, 3], -3],
        expected: 0,
      },
      {
        args: [[-3, -1, 1], 0],
        expected: 0,
      },
      {
        args: [[-3, -1, -1, 1, 2], -1],
        expected: 2,
      },
      {
        args: [[0], 0],
        expected: 1,
      },
      {
        args: [[], -2],
        expected: 0,
      },
    ],
    46: [
      {
        args: [
          {
            value: 10,
            left: {
              value: 5,
              left: null,
              right: {
                value: 12,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -1,
              left: null,
              right: null,
            },
            right: {
              value: 8,
              left: {
                value: 7,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -2,
            left: null,
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -6,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -4,
            left: null,
            right: {
              value: 3,
              left: null,
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: 1,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: {
                value: -1,
                left: {
                  value: -5,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: 2,
              left: {
                value: -5,
                left: {
                  value: -6,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: 3,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 4,
              left: null,
              right: null,
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -7,
              left: null,
              right: {
                value: -4,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: 2,
              left: null,
              right: null,
            },
            right: {
              value: 2,
              left: null,
              right: null,
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -2,
              left: {
                value: -7,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: -1,
              left: null,
              right: {
                value: 0,
                left: null,
                right: {
                  value: 6,
                  left: null,
                  right: null,
                },
              },
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: 0,
              left: null,
              right: {
                value: -4,
                left: null,
                right: null,
              },
            },
            right: {
              value: 7,
              left: {
                value: 0,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: false,
      },
    ],
    47: [
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: -1,
              left: {
                value: -5,
                left: {
                  value: -6,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: 6,
                left: {
                  value: 1,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
        ],
        expected: [-8, -1, 1, -5],
      },
      {
        args: [
          {
            value: 6,
            left: {
              value: 4,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: [6, 4],
      },
      {
        args: [
          {
            value: 0,
            left: null,
            right: {
              value: 5,
              left: null,
              right: null,
            },
          },
        ],
        expected: [0, 5],
      },
      {
        args: [
          {
            value: 0,
            left: null,
            right: null,
          },
        ],
        expected: [0],
      },
      {
        args: [
          {
            value: -4,
            left: {
              value: -8,
              left: null,
              right: {
                value: -6,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: [-4, -8, -6],
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: null,
          },
        ],
        expected: [-6],
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: 4,
              left: {
                value: 0,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: [-6, 4, 0],
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -5,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: {
                value: -1,
                left: null,
                right: {
                  value: 2,
                  left: null,
                  right: null,
                },
              },
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
        ],
        expected: [3, 2, -9, 2],
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: 1,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
        ],
        expected: [3, 1, -8],
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: -2,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: {
                value: 8,
                left: {
                  value: 0,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
        ],
        expected: [-6, -2, 4, 0],
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -1,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 6,
              left: {
                value: 4,
                left: {
                  value: 3,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: [0, 5, -4, 3],
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -6,
              left: null,
              right: {
                value: -5,
                left: null,
                right: null,
              },
            },
            right: {
              value: 8,
              left: {
                value: 7,
                left: {
                  value: -1,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: [-3, 2, 2, -1],
      },
    ],
    48: [
      {
        args: [[7]],
        expected: 0,
      },
      {
        args: [[0, 0, 0]],
        expected: 0,
      },
      {
        args: [[2]],
        expected: 0,
      },
      {
        args: [[1, 1, 0, 1, 2]],
        expected: 2,
      },
      {
        args: [[1, 3, 2, 2, 3]],
        expected: 5,
      },
      {
        args: [[3, 3, 0]],
        expected: 3,
      },
      {
        args: [[2, 1, 1, 2, 3]],
        expected: 3,
      },
      {
        args: [[1, 1, 3, 3]],
        expected: 4,
      },
      {
        args: [[3]],
        expected: 0,
      },
      {
        args: [[3, 0, 1, 3, 0, 3]],
        expected: 1,
      },
      {
        args: [[1, 2, 2, 3]],
        expected: 3,
      },
      {
        args: [[2, 3, 0, 2, 0, 3]],
        expected: 2,
      },
    ],
    49: [
      {
        args: [[[0]]],
        expected: 1,
      },
      {
        args: [[[0, 0, 1]]],
        expected: 0,
      },
      {
        args: [[[0, 0, 0]]],
        expected: 1,
      },
      {
        args: [[[0, 1, 0]]],
        expected: 0,
      },
      {
        args: [
          [
            [0, 0, 0],
            [0, 1, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [0, 0, 0],
            [1, 0, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [0, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [0, 1, 1],
            [0, 1, 0],
            [0, 1, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          [
            [0, 0, 1],
            [0, 1, 1],
            [0, 1, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          [
            [1, 1, 0],
            [1, 0, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [[[1, 0, 0]]],
        expected: 0,
      },
      {
        args: [
          [
            [1, 1, 1],
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0],
          ],
        ],
        expected: 0,
      },
    ],
    50: [
      {
        args: [[1, 1], [2, 2], 1],
        expected: [0],
      },
      {
        args: [[1, 1], [0, 0], 2],
        expected: [],
      },
      {
        args: [[], [], 7],
        expected: [],
      },
      {
        args: [[3, 3, 7, 1, 3], [1, 1, 3, 3, 1], 2],
        expected: [3],
      },
      {
        args: [[5, 5, 1, 3], [1, 1, 3, 1], 8],
        expected: [0, 2],
      },
      {
        args: [[5, 6, 7, 6], [1, 2, 3, 2], 3],
        expected: [],
      },
      {
        args: [[7, 6, 6, 5], [3, 2, 2, 1], 4],
        expected: [],
      },
      {
        args: [[4, 6, 6, 6, 4, 5], [0, 2, 2, 2, 0, 1], 0],
        expected: [],
      },
      {
        args: [[4, 2, 2, 3], [0, 2, 2, 1], 4],
        expected: [1, 2],
      },
      {
        args: [[5, 5, 4, 2, 7, 1], [1, 1, 0, 2, 3, 3], 6],
        expected: [3, 5],
      },
      {
        args: [[7, 1, 5], [3, 3, 1], 3],
        expected: [1],
      },
      {
        args: [[6], [2], 0],
        expected: [],
      },
    ],
    51: [
      {
        args: [[2, 2, 3]],
        expected: [1, 2, 3],
      },
      {
        args: [[3, 2, 1]],
        expected: [1, 1, 1],
      },
      {
        args: [[1, 0, 2, 1, -1]],
        expected: [1, 1, 3, 1, 1],
      },
      {
        args: [[3, -1, 0, -2, -3]],
        expected: [1, 1, 2, 1, 1],
      },
      {
        args: [[3]],
        expected: [1],
      },
      {
        args: [[-3, -3, 1, -1, -2]],
        expected: [1, 2, 3, 1, 1],
      },
      {
        args: [[-3]],
        expected: [1],
      },
      {
        args: [[0, -1, -3, 2]],
        expected: [1, 1, 1, 4],
      },
      {
        args: [[3, 3]],
        expected: [1, 2],
      },
      {
        args: [[-2, 3, 1, 2]],
        expected: [1, 2, 1, 2],
      },
      {
        args: [[-1, -3]],
        expected: [1, 1],
      },
      {
        args: [[1, 2, 2, -3]],
        expected: [1, 2, 3, 1],
      },
    ],
    52: [
      {
        args: [
          [
            [1, 2],
            [4, 5],
          ],
          [2, 4],
        ],
        expected: [[1, 5]],
      },
      {
        args: [[[-4, 5]], [3, 6]],
        expected: [[-4, 6]],
      },
      {
        args: [[[-4, 5]], [4, 7]],
        expected: [[-4, 7]],
      },
      {
        args: [[[-3, 5]], [-2, 1]],
        expected: [[-3, 5]],
      },
      {
        args: [
          [
            [-4, -3],
            [-2, 4],
          ],
          [-2, 1],
        ],
        expected: [
          [-4, -3],
          [-2, 4],
        ],
      },
      {
        args: [[], [4, 7]],
        expected: [[4, 7]],
      },
      {
        args: [[[-2, 5]], [-4, -1]],
        expected: [[-4, 5]],
      },
      {
        args: [[[-4, 5]], [2, 5]],
        expected: [[-4, 5]],
      },
      {
        args: [[[-4, 2]], [2, 5]],
        expected: [[-4, 5]],
      },
      {
        args: [[[-4, 4]], [-1, 2]],
        expected: [[-4, 4]],
      },
      {
        args: [[[-3, 4]], [4, 7]],
        expected: [[-3, 7]],
      },
      {
        args: [
          [
            [-4, 2],
            [3, 5],
          ],
          [-3, 0],
        ],
        expected: [
          [-4, 2],
          [3, 5],
        ],
      },
    ],
    53: [
      {
        args: [2318],
        expected: 5,
      },
      {
        args: [2092],
        expected: 4,
      },
      {
        args: [296],
        expected: 3,
      },
      {
        args: [1092],
        expected: 3,
      },
      {
        args: [2886],
        expected: 6,
      },
      {
        args: [1340],
        expected: 6,
      },
      {
        args: [1900],
        expected: 7,
      },
      {
        args: [3687],
        expected: 8,
      },
      {
        args: [3159],
        expected: 7,
      },
      {
        args: [2461],
        expected: 7,
      },
      {
        args: [1162],
        expected: 4,
      },
      {
        args: [2687],
        expected: 9,
      },
    ],
    54: [
      {
        args: [
          [
            ["put", 1, 7],
            ["put", 4, 8],
            ["put", 1, 9],
            ["get", 1],
            ["get", 4],
            ["get", 7],
          ],
          3,
        ],
        expected: [9, 8, null],
      },
      {
        args: [[["put", 2, 3]], 4],
        expected: [],
      },
      {
        args: [[["get", -3]], 4],
        expected: [null],
      },
      {
        args: [
          [
            ["get", 3],
            ["put", 1, 0],
          ],
          3,
        ],
        expected: [null],
      },
      {
        args: [
          [
            ["put", 2, 2],
            ["put", 1, 2],
            ["put", 0, 2],
            ["put", -3, 2],
            ["get", -2],
          ],
          1,
        ],
        expected: [null],
      },
      {
        args: [
          [
            ["put", -1, 4],
            ["get", 2],
            ["get", 3],
            ["put", 1, 4],
            ["put", 0, 4],
          ],
          1,
        ],
        expected: [null, null],
      },
      {
        args: [
          [
            ["put", 0, 2],
            ["get", -2],
            ["put", -2, 2],
            ["put", 1, 2],
          ],
          1,
        ],
        expected: [null],
      },
      {
        args: [
          [
            ["put", -1, -1],
            ["get", 3],
            ["put", -3, -1],
          ],
          2,
        ],
        expected: [null],
      },
      {
        args: [
          [
            ["put", -3, -3],
            ["get", -3],
          ],
          3,
        ],
        expected: [-3],
      },
      {
        args: [
          [
            ["get", 3],
            ["put", -2, 2],
          ],
          3,
        ],
        expected: [null],
      },
      {
        args: [
          [
            ["get", -2],
            ["put", -1, -3],
            ["put", 1, -3],
            ["get", -3],
            ["get", -3],
            ["put", 2, -3],
          ],
          3,
        ],
        expected: [null, null, null],
      },
      {
        args: [[["get", -3]], 2],
        expected: [null],
      },
    ],
    55: [
      {
        args: [[null], 0],
        expected: null,
      },
      {
        args: [[0, 1, null], 0],
        expected: 0,
      },
      {
        args: [[null, null, 2, 1], 1],
        expected: null,
      },
      {
        args: [[1, 0, null], 0],
        expected: 0,
      },
      {
        args: [[2, 0, 1], 2],
        expected: 2,
      },
      {
        args: [[0, null, 0, 3], 2],
        expected: 0,
      },
      {
        args: [[null, 0, 1, 1], 0],
        expected: null,
      },
      {
        args: [[2, 0, 0], 0],
        expected: 0,
      },
      {
        args: [[3, 1, 1, 3], 3],
        expected: 3,
      },
      {
        args: [[0, 1], 0],
        expected: 0,
      },
      {
        args: [[2, null, 1, 2], 3],
        expected: null,
      },
      {
        args: [[1, 0], 1],
        expected: 1,
      },
    ],
    56: [
      {
        args: [
          3,
          [
            [1, 2, -1],
            [2, 1, -1],
          ],
          0,
        ],
        expected: false,
      },
      {
        args: [2, [[1, 0, -1]], 0],
        expected: false,
      },
      {
        args: [
          2,
          [
            [0, 1, -2],
            [1, 1, 5],
            [0, 0, 1],
            [0, 1, 4],
            [0, 1, -3],
            [0, 1, -2],
          ],
          0,
        ],
        expected: false,
      },
      {
        args: [
          3,
          [
            [0, 2, -2],
            [0, 1, -2],
            [1, 1, -3],
          ],
          2,
        ],
        expected: false,
      },
      {
        args: [
          1,
          [
            [0, 0, -2],
            [0, 0, 5],
            [0, 0, -3],
            [0, 0, 5],
          ],
          0,
        ],
        expected: true,
      },
      {
        args: [
          3,
          [
            [0, 2, 3],
            [0, 0, 2],
            [0, 2, -1],
            [2, 1, 4],
            [2, 0, 5],
            [1, 0, 5],
          ],
          0,
        ],
        expected: false,
      },
      {
        args: [
          4,
          [
            [3, 0, 0],
            [1, 1, 0],
            [0, 3, 2],
            [2, 3, 4],
          ],
          0,
        ],
        expected: false,
      },
      {
        args: [
          3,
          [
            [1, 2, 1],
            [2, 2, 1],
            [0, 0, 0],
            [1, 0, 5],
          ],
          2,
        ],
        expected: false,
      },
      {
        args: [
          2,
          [
            [0, 1, -2],
            [1, 1, 1],
          ],
          0,
        ],
        expected: false,
      },
      {
        args: [
          1,
          [
            [0, 0, 3],
            [0, 0, 5],
          ],
          0,
        ],
        expected: false,
      },
      {
        args: [
          3,
          [
            [0, 0, 4],
            [0, 0, 5],
            [2, 1, 5],
            [1, 2, 3],
          ],
          1,
        ],
        expected: false,
      },
      {
        args: [
          2,
          [
            [1, 1, 1],
            [0, 1, 4],
            [0, 1, 2],
            [1, 1, 2],
          ],
          0,
        ],
        expected: false,
      },
    ],
    57: [
      {
        args: [
          [3, -1, -3, 2, 0, 0],
          [
            ["range", 0, 3],
            ["range", 1, 2],
            ["range", 1, 2],
            ["add", 0, 2],
            ["range", 0, 5],
          ],
        ],
        expected: [1, -4, -4, 3],
      },
      {
        args: [
          [-2, -2, 3, -2, 1, -3],
          [
            ["range", 2, 3],
            ["range", 1, 5],
            ["range", 0, 1],
            ["add", 0, 0],
            ["range", 0, 5],
          ],
        ],
        expected: [1, -3, -4, -5],
      },
      {
        args: [
          [1],
          [
            ["range", 0, 0],
            ["range", 0, 0],
            ["range", 0, 0],
            ["add", 0, -1],
            ["range", 0, 0],
          ],
        ],
        expected: [1, 1, 1, 0],
      },
      {
        args: [
          [-3, 3, -3],
          [
            ["range", 0, 1],
            ["range", 2, 2],
            ["range", 0, 1],
            ["add", 0, 0],
            ["range", 0, 2],
          ],
        ],
        expected: [0, -3, 0, -3],
      },
      {
        args: [
          [1, 2],
          [
            ["range", 1, 1],
            ["range", 1, 1],
            ["range", 0, 1],
            ["add", 0, 4],
            ["range", 0, 1],
          ],
        ],
        expected: [2, 2, 3, 7],
      },
      {
        args: [
          [-3, 0],
          [
            ["range", 0, 0],
            ["range", 0, 0],
            ["range", 0, 1],
            ["add", 0, 3],
            ["range", 0, 1],
          ],
        ],
        expected: [-3, -3, -3, 0],
      },
      {
        args: [
          [-1, 1, 3, 3, 0],
          [
            ["range", 1, 2],
            ["range", 3, 4],
            ["range", 3, 4],
            ["add", 0, 3],
            ["range", 0, 4],
          ],
        ],
        expected: [4, 3, 3, 9],
      },
      {
        args: [
          [0, 2, 2],
          [
            ["range", 2, 2],
            ["range", 1, 2],
            ["range", 0, 2],
            ["add", 0, 4],
            ["range", 0, 2],
          ],
        ],
        expected: [2, 4, 4, 8],
      },
      {
        args: [
          [2, 1, 2, 1, 2],
          [
            ["range", 0, 1],
            ["range", 1, 4],
            ["range", 0, 4],
            ["add", 0, -1],
            ["range", 0, 4],
          ],
        ],
        expected: [3, 6, 8, 7],
      },
      {
        args: [
          [-3],
          [
            ["range", 0, 0],
            ["range", 0, 0],
            ["range", 0, 0],
            ["add", 0, -1],
            ["range", 0, 0],
          ],
        ],
        expected: [-3, -3, -3, -4],
      },
      {
        args: [
          [3, -2, 0, 0, -3, 2],
          [
            ["range", 0, 2],
            ["range", 1, 2],
            ["range", 1, 3],
            ["add", 0, 4],
            ["range", 0, 5],
          ],
        ],
        expected: [1, -2, -2, 4],
      },
      {
        args: [
          [-2, -2, -3, 2],
          [
            ["range", 1, 1],
            ["range", 2, 3],
            ["range", 0, 2],
            ["add", 0, -1],
            ["range", 0, 3],
          ],
        ],
        expected: [-2, -1, -7, -6],
      },
    ],
    58: [
      {
        args: ["aaaab", "aab"],
        expected: [2],
      },
      {
        args: ["aAA", "a"],
        expected: [0],
      },
      {
        args: ["bb", "a"],
        expected: [],
      },
      {
        args: ["Abbb", "aa"],
        expected: [],
      },
      {
        args: ["b", "aba"],
        expected: [],
      },
      {
        args: ["ba", "aa"],
        expected: [],
      },
      {
        args: ["", "a"],
        expected: [],
      },
      {
        args: ["a", "aa"],
        expected: [],
      },
      {
        args: ["bb", "A"],
        expected: [],
      },
      {
        args: ["bb", "aa"],
        expected: [],
      },
      {
        args: ["ba", "a"],
        expected: [1],
      },
      {
        args: ["", "A"],
        expected: [],
      },
    ],
    59: [
      {
        args: [0, 0],
        expected: 0,
      },
      {
        args: [-18, 12],
        expected: 36,
      },
      {
        args: [4, -2],
        expected: 4,
      },
      {
        args: [-3, 14],
        expected: 42,
      },
      {
        args: [-1, 5],
        expected: 5,
      },
      {
        args: [2, -8],
        expected: 8,
      },
      {
        args: [-4, 4],
        expected: 4,
      },
      {
        args: [1, -2],
        expected: 2,
      },
      {
        args: [0, -18],
        expected: 0,
      },
      {
        args: [-2, 18],
        expected: 18,
      },
      {
        args: [4, 17],
        expected: 68,
      },
      {
        args: [-3, 3],
        expected: 3,
      },
    ],
    60: [
      {
        args: [[-2]],
        expected: -2,
      },
      {
        args: [[-3, 4, 5, 4, 5]],
        expected: 18,
      },
      {
        args: [[-4, -5, -3]],
        expected: -3,
      },
      {
        args: [[1, -2, 1, 0, -5, -1, -4]],
        expected: 1,
      },
      {
        args: [[4, 2, -2, 0, -5, 3, 0]],
        expected: 9,
      },
      {
        args: [[-5, -1, 1, 3, 1]],
        expected: 5,
      },
      {
        args: [[5, -3, 2]],
        expected: 7,
      },
      {
        args: [[-3, 2]],
        expected: 2,
      },
      {
        args: [[-2, 1, 3, -4, 0, -5, 4]],
        expected: 6,
      },
      {
        args: [[-4, -5, -4, 2, 1]],
        expected: 3,
      },
      {
        args: [[1, 3]],
        expected: 4,
      },
      {
        args: [[-3, 0, -4, 1, -4, -2, 4]],
        expected: 4,
      },
    ],
    61: [
      {
        args: [[0, 0, 1]],
        expected: 2,
      },
      {
        args: [[0, 1, 1, 0, 1]],
        expected: 4,
      },
      {
        args: [[1, 0, 1]],
        expected: 2,
      },
      {
        args: [[0, 1, 0, 0]],
        expected: 2,
      },
      {
        args: [[0, 0, 0, 0, 0]],
        expected: 0,
      },
      {
        args: [[1]],
        expected: 0,
      },
      {
        args: [[0, 0]],
        expected: 0,
      },
      {
        args: [[1, 0, 1, 1, 0, 1, 1]],
        expected: 4,
      },
      {
        args: [[0, 0, 0, 0, 1, 1, 1]],
        expected: 6,
      },
      {
        args: [[0, 1]],
        expected: 2,
      },
      {
        args: [[1, 1, 1, 1, 0, 0]],
        expected: 4,
      },
      {
        args: [[1, 1, 1, 1]],
        expected: 0,
      },
    ],
    62: [
      {
        args: [[5, 5, 5, 3, 1, 1, 4], 5],
        expected: 5,
      },
      {
        args: [[5, 2], 1],
        expected: 7,
      },
      {
        args: [[3, 2], 1],
        expected: 5,
      },
      {
        args: [[2, 4, 3, 5, 4, 4], 3],
        expected: 8,
      },
      {
        args: [[2, 3], 2],
        expected: 3,
      },
      {
        args: [[2, 5, 6, 4], 4],
        expected: 6,
      },
      {
        args: [[2, 5, 6], 1],
        expected: 13,
      },
      {
        args: [[6, 4, 2, 2, 6], 4],
        expected: 6,
      },
      {
        args: [[1, 5, 5, 3, 4, 4, 3], 4],
        expected: 7,
      },
      {
        args: [[6, 2, 6, 5, 1, 5], 4],
        expected: 8,
      },
      {
        args: [[1, 4], 3],
        expected: 4,
      },
      {
        args: [[6, 4, 6, 5], 2],
        expected: 11,
      },
    ],
    63: [
      {
        args: [5, [[4, 3]]],
        expected: [0, 0, 0, 0, 1],
      },
      {
        args: [
          4,
          [
            [1, 2],
            [3, 2],
            [1, 0],
            [2, 1],
            [0, 3],
            [2, 3],
            [1, 1],
          ],
        ],
        expected: [],
      },
      {
        args: [3, []],
        expected: [0, 0, 0],
      },
      {
        args: [
          3,
          [
            [0, 2],
            [1, 2],
            [2, 0],
            [1, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          3,
          [
            [0, 2],
            [1, 0],
            [1, 1],
            [0, 2],
            [0, 2],
            [0, 0],
            [2, 0],
            [0, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          [
            [0, 0],
            [1, 0],
            [1, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 1],
            [1, 0],
            [0, 1],
            [1, 0],
            [1, 1],
          ],
        ],
        expected: [],
      },
      {
        args: [
          4,
          [
            [1, 2],
            [3, 1],
            [3, 0],
            [2, 3],
            [2, 2],
            [3, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          4,
          [
            [0, 3],
            [0, 2],
            [0, 3],
            [3, 2],
            [2, 1],
            [0, 3],
            [2, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [2, [[1, 0]]],
        expected: [0, 1],
      },
      {
        args: [3, [[1, 1]]],
        expected: [],
      },
      {
        args: [5, [[1, 3]]],
        expected: [0, 0, 0, 1, 0],
      },
    ],
    64: [
      {
        args: [
          [
            [0, 1, 0, 2],
            [0, 0, 0, 0],
            [1, 1, 0, 2],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [
            [1, 2, 0],
            [0, 1, 1],
            [1, 0, 1],
            [2, 1, 2],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [1, 2],
            [1, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [[[0, 0, 1, 0]]],
        expected: -1,
      },
      {
        args: [[[1, 0, 0, 0]]],
        expected: -1,
      },
      {
        args: [[[1], [0], [1], [0]]],
        expected: -1,
      },
      {
        args: [[[], [], [], []]],
        expected: 0,
      },
      {
        args: [[[], []]],
        expected: 0,
      },
      {
        args: [
          [
            [2, 0, 0],
            [1, 1, 2],
            [0, 2, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [[[], [], []]],
        expected: 0,
      },
      {
        args: [[[0], [0]]],
        expected: 0,
      },
      {
        args: [[[2], [0], [2], [0]]],
        expected: 0,
      },
    ],
    65: [
      {
        args: ["1A", "1A0"],
        expected: 1,
      },
      {
        args: ["aaB", "!aaa0B"],
        expected: 3,
      },
      {
        args: ["!!100", ""],
        expected: 5,
      },
      {
        args: ["!éb1!BA", "1!1é"],
        expected: 7,
      },
      {
        args: ["1a!", "é0Ab"],
        expected: 7,
      },
      {
        args: ["0a1b1!", "1"],
        expected: 5,
      },
      {
        args: ["ébéAbé1", "Bab11"],
        expected: 8,
      },
      {
        args: ["!", "AA1A!"],
        expected: 4,
      },
      {
        args: ["", ""],
        expected: 0,
      },
      {
        args: ["0aa1", "bb"],
        expected: 6,
      },
      {
        args: ["A", ""],
        expected: 1,
      },
      {
        args: ["A!", "é!ab!Ab"],
        expected: 7,
      },
    ],
    66: [
      {
        args: [[-5, 3, -5, 2, 0], -4],
        expected: [[-5, -5], [], [3, 2, 0]],
      },
      {
        args: [[3, 4, 0, -2], -4],
        expected: [[], [], [3, 4, 0, -2]],
      },
      {
        args: [[4, 2, -4, 0, -3, -2, -4], -4],
        expected: [[], [-4, -4], [4, 2, 0, -3, -2]],
      },
      {
        args: [[-5, -2, -1], -3],
        expected: [[-5], [], [-2, -1]],
      },
      {
        args: [[1], -2],
        expected: [[], [], [1]],
      },
      {
        args: [[], -3],
        expected: [[], [], []],
      },
      {
        args: [[-4, -1], 3],
        expected: [[-4, -1], [], []],
      },
      {
        args: [[5, 2, -3, 4, -4], 2],
        expected: [[-3, -4], [2], [5, 4]],
      },
      {
        args: [[-3, 1, -4, 0, 4, -4, -3], -3],
        expected: [
          [-4, -4],
          [-3, -3],
          [1, 0, 4],
        ],
      },
      {
        args: [[-3, 5], -4],
        expected: [[], [], [-3, 5]],
      },
      {
        args: [[2, -3, 3, 5], 3],
        expected: [[2, -3], [3], [5]],
      },
      {
        args: [[1, -1, -2, -4], -3],
        expected: [[-4], [], [1, -1, -2]],
      },
    ],
    67: [
      {
        args: [2],
        expected: 4,
      },
      {
        args: [7],
        expected: 49,
      },
      {
        args: [6],
        expected: 36,
      },
      {
        args: [23],
        expected: 529,
      },
      {
        args: [13],
        expected: 169,
      },
      {
        args: [30],
        expected: 900,
      },
      {
        args: [19],
        expected: 361,
      },
      {
        args: [16],
        expected: 256,
      },
      {
        args: [8],
        expected: 64,
      },
      {
        args: [9],
        expected: 81,
      },
      {
        args: [24],
        expected: 576,
      },
      {
        args: [26],
        expected: 676,
      },
    ],
    68: [
      {
        args: [2],
        expected: 3,
      },
      {
        args: [16],
        expected: 31,
      },
      {
        args: [32],
        expected: 63,
      },
      {
        args: [64],
        expected: 127,
      },
      {
        args: [128],
        expected: 255,
      },
      {
        args: [256],
        expected: 511,
      },
      {
        args: [512],
        expected: 1023,
      },
      {
        args: [1024],
        expected: 2047,
      },
    ],
    69: [
      {
        args: [62],
        expected: [1, 2, 4, 8, 16, 32],
      },
      {
        args: [22],
        expected: [1, 2, 4, 8, 16],
      },
      {
        args: [25],
        expected: [1, 2, 4, 8, 16],
      },
      {
        args: [58],
        expected: [1, 2, 4, 8, 16, 32],
      },
      {
        args: [68],
        expected: [1, 2, 4, 8, 16, 32, 64],
      },
      {
        args: [70],
        expected: [1, 2, 4, 8, 16, 32, 64],
      },
      {
        args: [29],
        expected: [1, 2, 4, 8, 16],
      },
      {
        args: [3],
        expected: [1, 2],
      },
      {
        args: [14],
        expected: [1, 2, 4, 8],
      },
      {
        args: [41],
        expected: [1, 2, 4, 8, 16, 32],
      },
      {
        args: [73],
        expected: [1, 2, 4, 8, 16, 32, 64],
      },
      {
        args: [19],
        expected: [1, 2, 4, 8, 16],
      },
    ],
    70: [
      {
        args: [28748],
        expected: 15,
      },
      {
        args: [88347],
        expected: 17,
      },
      {
        args: [90360],
        expected: 17,
      },
      {
        args: [60693],
        expected: 16,
      },
      {
        args: [60920],
        expected: 16,
      },
      {
        args: [27534],
        expected: 15,
      },
      {
        args: [86592],
        expected: 17,
      },
      {
        args: [44215],
        expected: 16,
      },
      {
        args: [10843],
        expected: 14,
      },
      {
        args: [54729],
        expected: 16,
      },
      {
        args: [33493],
        expected: 16,
      },
      {
        args: [39999],
        expected: 16,
      },
    ],
    71: [
      {
        args: [[17, 15, -3, 6, 9, -5]],
        expected: [-5, -3, 6, 9, 15, 17],
      },
      {
        args: [[-18, -7, 5]],
        expected: [-18, -7, 5],
      },
      {
        args: [[18, 15, 16, -8]],
        expected: [-8, 15, 16, 18],
      },
      {
        args: [[20]],
        expected: [20],
      },
      {
        args: [[-11, 19, -5, 16, -6, -2, 9]],
        expected: [-11, -6, -5, -2, 9, 16, 19],
      },
      {
        args: [[-13, 0, 9]],
        expected: [-13, 0, 9],
      },
      {
        args: [[5, -17, -11, 18]],
        expected: [-17, -11, 5, 18],
      },
      {
        args: [[12, 7, 0]],
        expected: [0, 7, 12],
      },
      {
        args: [[-6, -4, 3, -6, 0, 1, -9]],
        expected: [-9, -6, -6, -4, 0, 1, 3],
      },
      {
        args: [[14]],
        expected: [14],
      },
      {
        args: [[8]],
        expected: [8],
      },
      {
        args: [[-16]],
        expected: [-16],
      },
    ],
    72: [
      {
        args: [[5695, 4631, 2875, 8907, 9096, 1888], 100],
        expected: [9096, 5695, 4631, 2875, 1888, 8907],
      },
      {
        args: [[], 1000],
        expected: [],
      },
      {
        args: [[3220], 10],
        expected: [3220],
      },
      {
        args: [[3865, 5009, 7154, 6478], 10],
        expected: [5009, 7154, 3865, 6478],
      },
      {
        args: [[4467, 7817, 3653], 10],
        expected: [7817, 3653, 4467],
      },
      {
        args: [[8947, 8646, 7902, 9391, 6890], 1],
        expected: [6890, 9391, 7902, 8646, 8947],
      },
      {
        args: [[2005], 1],
        expected: [2005],
      },
      {
        args: [[8140, 252, 3248, 5851], 10],
        expected: [8140, 3248, 252, 5851],
      },
      {
        args: [[1308, 971], 1],
        expected: [971, 1308],
      },
      {
        args: [[7856], 1],
        expected: [7856],
      },
      {
        args: [[1271, 2323, 5675, 4749, 177, 6542, 4891], 100],
        expected: [177, 1271, 2323, 6542, 5675, 4749, 4891],
      },
      {
        args: [[7178, 7835, 9148, 1208, 6250], 100],
        expected: [7178, 9148, 1208, 6250, 7835],
      },
    ],
    73: [
      {
        args: [[0, 2, -4, 5, 4, -5, 4], 3],
        expected: 4,
      },
      {
        args: [[-2], 1],
        expected: -2,
      },
      {
        args: [[-2, 1], 2],
        expected: -2,
      },
      {
        args: [[1, 1, 4], 2],
        expected: 1,
      },
      {
        args: [[-3, -3, 1], 3],
        expected: -3,
      },
      {
        args: [[-5], 1],
        expected: -5,
      },
      {
        args: [[-1, -4, -5], 1],
        expected: -1,
      },
      {
        args: [[3], 1],
        expected: 3,
      },
      {
        args: [[4], 1],
        expected: 4,
      },
      {
        args: [[0, 3, 4], 2],
        expected: 3,
      },
      {
        args: [[-4], 1],
        expected: -4,
      },
      {
        args: [[-4, 0, -3, 3], 1],
        expected: 3,
      },
    ],
    74: [
      {
        args: [
          [
            [1, "id0"],
            [3, "id1"],
            [3, "id2"],
            [2, "id3"],
            [3, "id4"],
            [1, "id5"],
            [1, "id6"],
          ],
        ],
        expected: [
          [3, "id1"],
          [3, "id2"],
          [3, "id4"],
          [2, "id3"],
          [1, "id0"],
          [1, "id5"],
          [1, "id6"],
        ],
      },
      {
        args: [[[0, "id0"]]],
        expected: [[0, "id0"]],
      },
      {
        args: [[[3, "id0"]]],
        expected: [[3, "id0"]],
      },
      {
        args: [
          [
            [3, "id0"],
            [2, "id1"],
            [1, "id2"],
            [2, "id3"],
            [2, "id4"],
          ],
        ],
        expected: [
          [3, "id0"],
          [2, "id1"],
          [2, "id3"],
          [2, "id4"],
          [1, "id2"],
        ],
      },
      {
        args: [
          [
            [1, "id0"],
            [2, "id1"],
            [3, "id2"],
            [1, "id3"],
            [0, "id4"],
            [2, "id5"],
            [0, "id6"],
          ],
        ],
        expected: [
          [3, "id2"],
          [2, "id1"],
          [2, "id5"],
          [1, "id0"],
          [1, "id3"],
          [0, "id4"],
          [0, "id6"],
        ],
      },
      {
        args: [
          [
            [2, "id0"],
            [3, "id1"],
          ],
        ],
        expected: [
          [3, "id1"],
          [2, "id0"],
        ],
      },
      {
        args: [
          [
            [0, "id0"],
            [0, "id1"],
            [0, "id2"],
            [2, "id3"],
            [1, "id4"],
          ],
        ],
        expected: [
          [2, "id3"],
          [1, "id4"],
          [0, "id0"],
          [0, "id1"],
          [0, "id2"],
        ],
      },
      {
        args: [
          [
            [0, "id0"],
            [3, "id1"],
            [2, "id2"],
            [0, "id3"],
            [1, "id4"],
          ],
        ],
        expected: [
          [3, "id1"],
          [2, "id2"],
          [1, "id4"],
          [0, "id0"],
          [0, "id3"],
        ],
      },
      {
        args: [
          [
            [0, "id0"],
            [1, "id1"],
            [2, "id2"],
            [0, "id3"],
            [2, "id4"],
            [2, "id5"],
          ],
        ],
        expected: [
          [2, "id2"],
          [2, "id4"],
          [2, "id5"],
          [1, "id1"],
          [0, "id0"],
          [0, "id3"],
        ],
      },
      {
        args: [
          [
            [3, "id0"],
            [0, "id1"],
            [1, "id2"],
            [3, "id3"],
            [3, "id4"],
            [1, "id5"],
            [0, "id6"],
          ],
        ],
        expected: [
          [3, "id0"],
          [3, "id3"],
          [3, "id4"],
          [1, "id2"],
          [1, "id5"],
          [0, "id1"],
          [0, "id6"],
        ],
      },
      {
        args: [
          [
            [1, "id0"],
            [1, "id1"],
            [2, "id2"],
            [2, "id3"],
            [1, "id4"],
            [3, "id5"],
          ],
        ],
        expected: [
          [3, "id5"],
          [2, "id2"],
          [2, "id3"],
          [1, "id0"],
          [1, "id1"],
          [1, "id4"],
        ],
      },
      {
        args: [
          [
            [2, "id0"],
            [2, "id1"],
          ],
        ],
        expected: [
          [2, "id0"],
          [2, "id1"],
        ],
      },
    ],
    75: [
      {
        args: [null, [3, 0, -5, 3, 4, 3, 0]],
        expected: null,
      },
      {
        args: [
          {
            value: -3,
            left: null,
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
          [4, -2, 3, 2, 5, 3],
        ],
        expected: {
          value: -3,
          left: null,
          right: {
            value: 8,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: null,
          },
          [-5, 1],
        ],
        expected: {
          value: -8,
          left: null,
          right: null,
        },
      },
      {
        args: [null, [0, 2, 4, 1, -4]],
        expected: null,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -7,
              left: null,
              right: {
                value: -6,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          [5, -1, 2],
        ],
        expected: {
          value: 3,
          left: {
            value: -7,
            left: null,
            right: {
              value: -6,
              left: null,
              right: null,
            },
          },
          right: null,
        },
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -3,
              left: null,
              right: null,
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
          [4],
        ],
        expected: {
          value: 2,
          left: {
            value: -3,
            left: null,
            right: null,
          },
          right: {
            value: 7,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: -8,
              left: null,
              right: {
                value: -6,
                left: null,
                right: null,
              },
            },
            right: {
              value: 3,
              left: null,
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
          },
          [1, -5, 2, -3],
        ],
        expected: {
          value: 3,
          left: {
            value: -8,
            left: null,
            right: {
              value: -6,
              left: null,
              right: null,
            },
          },
          right: {
            value: 7,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: -5,
              left: null,
              right: null,
            },
          },
          [-2, -3, 0, 3, 3],
        ],
        expected: {
          value: -8,
          left: null,
          right: {
            value: -5,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: -7,
            left: null,
            right: {
              value: 8,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          [0, -3, -4, -4, -4],
        ],
        expected: {
          value: -7,
          left: null,
          right: {
            value: 8,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -5,
              left: {
                value: -7,
                left: null,
                right: null,
              },
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          [1, 4],
        ],
        expected: {
          value: 8,
          left: {
            value: -5,
            left: {
              value: -7,
              left: null,
              right: null,
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
          right: null,
        },
      },
      {
        args: [
          {
            value: -3,
            left: null,
            right: {
              value: 6,
              left: null,
              right: null,
            },
          },
          [0, -2, -2, -5],
        ],
        expected: {
          value: -3,
          left: null,
          right: {
            value: 6,
            left: null,
            right: null,
          },
        },
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: -6,
              left: null,
              right: {
                value: -3,
                left: null,
                right: {
                  value: -2,
                  left: null,
                  right: {
                    value: 0,
                    left: null,
                    right: null,
                  },
                },
              },
            },
            right: null,
          },
          [-4, -1],
        ],
        expected: {
          value: 4,
          left: {
            value: -6,
            left: null,
            right: {
              value: -3,
              left: null,
              right: {
                value: -2,
                left: null,
                right: {
                  value: 0,
                  left: null,
                  right: null,
                },
              },
            },
          },
          right: null,
        },
      },
    ],
    76: [
      {
        args: [[1, -3, -2]],
        expected: 2,
      },
      {
        args: [[1, -1]],
        expected: 2,
      },
      {
        args: [[2, 4, 1]],
        expected: 2,
      },
      {
        args: [[-5, -4, -2, -3, -3]],
        expected: 3,
      },
      {
        args: [[-3, -4, -5, -4]],
        expected: 2,
      },
      {
        args: [[-4, -4, 4]],
        expected: 2,
      },
      {
        args: [[-3]],
        expected: 1,
      },
      {
        args: [[4, -2, 4]],
        expected: 2,
      },
      {
        args: [[-4, 4]],
        expected: 2,
      },
      {
        args: [[-1, 3]],
        expected: 2,
      },
      {
        args: [[1, 5, -3, 3, 4, 1, -1]],
        expected: 3,
      },
      {
        args: [[5, -3, -1, 3, -1, 0, -1]],
        expected: 3,
      },
    ],
    77: [
      {
        args: [
          {
            value: -2,
            left: null,
            right: null,
          },
          0,
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: -5,
            left: null,
            right: {
              value: 0,
              left: {
                value: -3,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          -2,
        ],
        expected: 2,
      },
      {
        args: [null, -3],
        expected: 0,
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: 4,
              left: {
                value: -2,
                left: {
                  value: -5,
                  left: null,
                  right: null,
                },
                right: {
                  value: 3,
                  left: null,
                  right: null,
                },
              },
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
          },
          7,
        ],
        expected: 5,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: 2,
              left: {
                value: 0,
                left: {
                  value: -7,
                  left: {
                    value: -8,
                    left: null,
                    right: null,
                  },
                  right: null,
                },
                right: null,
              },
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          -5,
        ],
        expected: 2,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: 6,
              left: {
                value: -4,
                left: {
                  value: -5,
                  left: null,
                  right: null,
                },
                right: {
                  value: -2,
                  left: null,
                  right: {
                    value: 4,
                    left: null,
                    right: null,
                  },
                },
              },
              right: null,
            },
            right: null,
          },
          3,
        ],
        expected: 3,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: -4,
              left: {
                value: -7,
                left: null,
                right: {
                  value: -6,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: null,
          },
          -6,
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: -6,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: 3,
              left: {
                value: -1,
                left: {
                  value: -2,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: 6,
                left: null,
                right: null,
              },
            },
          },
          -6,
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: 5,
              left: {
                value: -1,
                left: {
                  value: -7,
                  left: null,
                  right: null,
                },
                right: {
                  value: 4,
                  left: {
                    value: 0,
                    left: null,
                    right: null,
                  },
                  right: null,
                },
              },
              right: null,
            },
            right: null,
          },
          -9,
        ],
        expected: 0,
      },
      {
        args: [
          {
            value: -4,
            left: null,
            right: {
              value: -3,
              left: null,
              right: null,
            },
          },
          8,
        ],
        expected: 2,
      },
      {
        args: [
          {
            value: 7,
            left: {
              value: 0,
              left: {
                value: -3,
                left: null,
                right: null,
              },
              right: null,
            },
            right: null,
          },
          -6,
        ],
        expected: 0,
      },
      {
        args: [
          {
            value: -3,
            left: null,
            right: null,
          },
          -2,
        ],
        expected: 1,
      },
    ],
    78: [
      {
        args: [
          {
            value: -2,
            left: {
              value: -6,
              left: null,
              right: {
                value: -5,
                left: null,
                right: null,
              },
            },
            right: {
              value: 8,
              left: {
                value: 6,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          -5,
          2,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -7,
              left: null,
              right: {
                value: -4,
                left: null,
                right: null,
              },
            },
            right: {
              value: 5,
              left: {
                value: 3,
                left: {
                  value: 2,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
          },
          -2,
          3,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: -6,
            left: {
              value: -7,
              left: null,
              right: null,
            },
            right: {
              value: 7,
              left: {
                value: -5,
                left: null,
                right: {
                  value: 0,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
          },
          -4,
          2,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: -3,
              left: null,
              right: null,
            },
            right: null,
          },
          0,
          4,
        ],
        expected: -1,
      },
      {
        args: [null, 5, -4],
        expected: -1,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: -1,
              left: null,
              right: {
                value: 3,
                left: {
                  value: 2,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
          -2,
          1,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: -2,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
          7,
          -6,
        ],
        expected: -1,
      },
      {
        args: [null, -6, 3],
        expected: -1,
      },
      {
        args: [
          {
            value: 0,
            left: null,
            right: {
              value: 1,
              left: null,
              right: {
                value: 4,
                left: null,
                right: null,
              },
            },
          },
          -1,
          7,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -5,
              left: null,
              right: {
                value: -2,
                left: null,
                right: null,
              },
            },
            right: {
              value: 8,
              left: {
                value: 1,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          -3,
          5,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -8,
              left: null,
              right: {
                value: -5,
                left: {
                  value: -6,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: null,
          },
          -2,
          6,
        ],
        expected: -1,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -6,
              left: null,
              right: {
                value: -5,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          -8,
          -7,
        ],
        expected: -1,
      },
    ],
    79: [
      {
        args: [
          [-4, 3, 5],
          [
            ["set", 0, 4],
            ["set", 1, -2],
            ["min", 2, 2],
          ],
        ],
        expected: [5],
      },
      {
        args: [[-2, -1, 2, 0, -1, 5], []],
        expected: [],
      },
      {
        args: [
          [-5, -2, -1],
          [
            ["set", 1, 1],
            ["min", 2, 2],
            ["min", 1, 2],
            ["min", 0, 0],
          ],
        ],
        expected: [-1, -1, -5],
      },
      {
        args: [[4, 5], []],
        expected: [],
      },
      {
        args: [
          [-4, 5, 5, -5, -3],
          [
            ["min", 2, 2],
            ["min", 1, 2],
            ["set", 3, 2],
            ["set", 3, 4],
            ["set", 4, 1],
          ],
        ],
        expected: [5, 5],
      },
      {
        args: [
          [2, 4, 0, -2],
          [
            ["min", 0, 0],
            ["set", 1, -5],
            ["set", 2, 1],
            ["min", 2, 3],
          ],
        ],
        expected: [2, -2],
      },
      {
        args: [
          [3, -3],
          [
            ["min", 0, 1],
            ["min", 0, 0],
            ["set", 1, -2],
            ["min", 0, 0],
            ["set", 1, -1],
          ],
        ],
        expected: [-3, 3, 3],
      },
      {
        args: [
          [0],
          [
            ["set", 0, -2],
            ["min", 0, 0],
          ],
        ],
        expected: [-2],
      },
      {
        args: [[5, 4, -3], [["set", 0, -3]]],
        expected: [],
      },
      {
        args: [
          [0, -2],
          [
            ["set", 0, -1],
            ["min", 0, 0],
            ["min", 0, 1],
            ["set", 1, -5],
            ["min", 0, 0],
            ["set", 1, -1],
          ],
        ],
        expected: [-1, -2, -1],
      },
      {
        args: [
          [2, -1],
          [
            ["set", 1, 0],
            ["min", 0, 0],
            ["set", 0, 4],
            ["min", 1, 1],
          ],
        ],
        expected: [2, 0],
      },
      {
        args: [
          [-2, -5, 3, 5, 3, -4],
          [
            ["min", 2, 5],
            ["min", 3, 5],
            ["min", 0, 2],
            ["set", 4, 4],
            ["min", 2, 4],
          ],
        ],
        expected: [-4, -4, -5, 3],
      },
    ],
    80: [
      {
        args: [
          3,
          [
            [2, 0],
            [2, 0],
            [0, 2],
            [1, 0],
            [2, 0],
            [1, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 6,
      },
      {
        args: [3, [[1, 2]]],
        expected: 0,
      },
      {
        args: [
          5,
          [
            [3, 2],
            [1, 4],
            [4, 3],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [1, 0],
            [1, 0],
            [2, 0],
            [1, 2],
            [1, 1],
            [1, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [4, [[0, 1]]],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 0],
            [1, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [0, []],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [1, 2],
            [0, 3],
            [3, 2],
            [3, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [3, 2],
            [0, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [3, []],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [1, 0],
            [1, 2],
            [0, 2],
            [3, 3],
          ],
        ],
        expected: 1,
      },
    ],
    81: [
      {
        args: [
          3,
          [
            [2, 0],
            [0, 0],
            [0, 0],
            [1, 1],
            [0, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          4,
          [
            [0, 2],
            [0, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [1, 1],
            [0, 2],
            [0, 1],
            [1, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [1, 0],
            [0, 3],
            [1, 2],
            [0, 3],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 1],
            [0, 1],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [2, 0],
            [2, 3],
            [3, 0],
            [1, 0],
            [1, 2],
          ],
        ],
        expected: 1,
      },
      {
        args: [3, [[2, 1]]],
        expected: 2,
      },
      {
        args: [1, [[0, 0]]],
        expected: 1,
      },
      {
        args: [
          5,
          [
            [1, 0],
            [4, 2],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          3,
          [
            [0, 0],
            [1, 1],
            [0, 2],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          3,
          [
            [0, 1],
            [1, 0],
            [0, 0],
            [0, 1],
          ],
        ],
        expected: 2,
      },
    ],
    82: [
      {
        args: [5, []],
        expected: [[0], [1], [2], [3], [4]],
      },
      {
        args: [
          5,
          [
            [2, 4],
            [1, 3],
            [1, 0],
            [3, 3],
            [3, 0],
          ],
        ],
        expected: [[0, 1, 3], [2], [4]],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [[0]],
      },
      {
        args: [4, []],
        expected: [[0], [1], [2], [3]],
      },
      {
        args: [
          5,
          [
            [4, 3],
            [2, 4],
            [3, 0],
            [4, 1],
            [1, 4],
          ],
        ],
        expected: [[0], [1, 4], [2], [3]],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [[0]],
      },
      {
        args: [
          3,
          [
            [2, 2],
            [1, 0],
            [0, 1],
            [0, 0],
            [1, 0],
            [2, 2],
          ],
        ],
        expected: [[0, 1], [2]],
      },
      {
        args: [
          3,
          [
            [2, 2],
            [1, 1],
            [0, 2],
            [0, 2],
            [2, 2],
          ],
        ],
        expected: [[0, 2], [1]],
      },
      {
        args: [
          5,
          [
            [3, 0],
            [0, 1],
            [1, 1],
          ],
        ],
        expected: [[0], [1], [2], [3], [4]],
      },
      {
        args: [2, [[0, 1]]],
        expected: [[0], [1]],
      },
      {
        args: [
          3,
          [
            [1, 2],
            [0, 0],
            [1, 2],
            [2, 1],
            [2, 0],
            [1, 1],
          ],
        ],
        expected: [[0], [1, 2]],
      },
      {
        args: [
          4,
          [
            [2, 1],
            [0, 2],
            [3, 2],
          ],
        ],
        expected: [[0], [1], [2], [3]],
      },
    ],
    83: [
      {
        args: [
          4,
          [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 1],
          ],
        ],
        expected: [1, 2, 1, 1],
      },
      {
        args: [
          5,
          [
            [2, 0],
            [0, 3],
            [0, 3],
          ],
        ],
        expected: [4, 2, 3, 3, 2],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [0],
      },
      {
        args: [
          3,
          [
            [2, 1],
            [1, 2],
            [2, 0],
            [0, 2],
            [2, 0],
          ],
        ],
        expected: [1, 1, 2],
      },
      {
        args: [
          3,
          [
            [0, 2],
            [1, 1],
            [2, 2],
            [2, 2],
            [1, 2],
            [2, 0],
          ],
        ],
        expected: [1, 1, 2],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [0],
      },
      {
        args: [
          4,
          [
            [0, 3],
            [3, 3],
            [1, 1],
            [0, 2],
            [3, 2],
            [2, 0],
          ],
        ],
        expected: [2, 1, 2, 2],
      },
      {
        args: [
          2,
          [
            [0, 1],
            [1, 0],
            [0, 0],
          ],
        ],
        expected: [1, 1],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [0, 1],
          ],
        ],
        expected: [1, 1],
      },
      {
        args: [
          5,
          [
            [1, 1],
            [2, 3],
            [2, 4],
          ],
        ],
        expected: [2, 2, 4, 3, 3],
      },
      {
        args: [
          3,
          [
            [1, 1],
            [0, 1],
            [0, 2],
          ],
        ],
        expected: [2, 1, 1],
      },
      {
        args: [
          3,
          [
            [0, 0],
            [2, 1],
            [1, 2],
            [2, 2],
            [0, 0],
          ],
        ],
        expected: [1, 2, 2],
      },
    ],
    84: [
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          0,
          0,
        ],
        expected: -1,
      },
      {
        args: [4, [[0, 1]], 3, 1],
        expected: 0,
      },
      {
        args: [
          5,
          [
            [4, 3],
            [2, 0],
            [2, 4],
          ],
          1,
          0,
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [0, 2],
            [0, 2],
          ],
          2,
          2,
        ],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          0,
          0,
        ],
        expected: -1,
      },
      {
        args: [5, [[0, 3]], 1, 3],
        expected: 0,
      },
      {
        args: [5, [], 4, 2],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 1],
            [0, 0],
          ],
          1,
          1,
        ],
        expected: -1,
      },
      {
        args: [
          3,
          [
            [2, 2],
            [1, 0],
            [2, 1],
            [2, 0],
          ],
          2,
          2,
        ],
        expected: -1,
      },
      {
        args: [5, [[0, 4]], 2, 2],
        expected: 1,
      },
      {
        args: [5, [], 2, 0],
        expected: 0,
      },
      {
        args: [4, [[0, 3]], 1, 2],
        expected: 0,
      },
    ],
    85: [
      {
        args: [5, []],
        expected: -1,
      },
      {
        args: [
          3,
          [
            [1, 0, 3],
            [2, 1, 2],
            [1, 1, 4],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          1,
          [
            [0, 0, 4],
            [0, 0, 0],
            [0, 0, 5],
            [0, 0, 4],
            [0, 0, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          1,
          [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 5],
          ],
        ],
        expected: 0,
      },
      {
        args: [5, [[4, 0, 0]]],
        expected: -1,
      },
      {
        args: [
          2,
          [
            [1, 1, 2],
            [1, 1, 2],
            [0, 1, 4],
            [1, 1, 0],
            [0, 0, 1],
            [1, 1, 3],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          5,
          [
            [0, 1, 2],
            [0, 3, 1],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          3,
          [
            [1, 2, 2],
            [2, 1, 2],
            [2, 0, 4],
            [0, 1, 3],
            [0, 2, 1],
            [1, 0, 2],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          2,
          [
            [0, 1, 2],
            [0, 0, 0],
            [1, 0, 2],
            [0, 0, 0],
            [1, 0, 2],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          2,
          [
            [0, 0, 3],
            [0, 1, 2],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          3,
          [
            [2, 2, 0],
            [1, 1, 2],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [1, 0, 3],
            [1, 2, 1],
          ],
        ],
        expected: -1,
      },
    ],
    86: [
      {
        args: [
          3,
          [
            [2, 0, 6],
            [0, 2, -1],
            [1, 1, 1],
            [1, 1, -1],
            [2, 1, 2],
          ],
        ],
        expected: 1,
      },
      {
        args: [4, []],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [2, 0, 6],
            [1, 3, 6],
            [2, 3, 3],
            [1, 2, 5],
            [1, 3, -1],
          ],
        ],
        expected: 8,
      },
      {
        args: [5, [[0, 0, 6]]],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [0, 1, -2],
            [0, 1, 3],
            [0, 1, -2],
            [1, 1, 2],
          ],
        ],
        expected: -2,
      },
      {
        args: [
          4,
          [
            [2, 3, -2],
            [0, 0, -2],
          ],
        ],
        expected: -2,
      },
      {
        args: [2, []],
        expected: 0,
      },
      {
        args: [
          1,
          [
            [0, 0, 6],
            [0, 0, -3],
            [0, 0, 6],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [0, 2, -1],
            [2, 2, -3],
            [0, 0, -2],
            [0, 0, 6],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [3, 3, 2],
            [3, 3, -2],
            [3, 3, 0],
            [1, 2, 5],
          ],
        ],
        expected: 5,
      },
      {
        args: [
          5,
          [
            [3, 0, 2],
            [0, 3, 6],
            [3, 2, -3],
            [3, 2, 4],
            [3, 1, -1],
          ],
        ],
        expected: -2,
      },
      {
        args: [
          2,
          [
            [0, 1, 5],
            [0, 1, 5],
            [0, 1, 4],
          ],
        ],
        expected: 4,
      },
    ],
    87: [
      {
        args: [
          6,
          [
            [0, 1, 1],
            [0, 2, 1],
            [1, 3, 1],
            [1, 4, 1],
            [2, 3, 1],
            [3, 5, 1],
            [4, 5, 1],
          ],
          0,
          5,
        ],
        expected: [0],
      },
      {
        args: [
          3,
          [
            [0, 0, 0],
            [0, 1, 3],
            [0, 0, 4],
            [1, 1, 3],
            [2, 0, 0],
            [0, 1, 4],
          ],
          0,
          2,
        ],
        expected: [0, 1],
      },
      {
        args: [3, [], 0, 2],
        expected: [0],
      },
      {
        args: [
          4,
          [
            [1, 3, 1],
            [3, 1, 1],
            [3, 3, 2],
            [0, 2, 3],
          ],
          0,
          3,
        ],
        expected: [0, 2],
      },
      {
        args: [
          2,
          [
            [1, 0, 0],
            [1, 1, 3],
            [0, 1, 4],
            [0, 0, 1],
            [0, 0, 1],
          ],
          0,
          1,
        ],
        expected: [0],
      },
      {
        args: [
          4,
          [
            [2, 0, 2],
            [1, 0, 0],
            [2, 2, 1],
            [2, 0, 4],
          ],
          0,
          3,
        ],
        expected: [0],
      },
      {
        args: [4, [[0, 0, 0]], 0, 3],
        expected: [0],
      },
      {
        args: [4, [], 0, 3],
        expected: [0],
      },
      {
        args: [
          3,
          [
            [1, 1, 4],
            [2, 2, 1],
          ],
          0,
          2,
        ],
        expected: [0],
      },
      {
        args: [
          5,
          [
            [1, 1, 1],
            [0, 0, 3],
            [0, 4, 0],
            [0, 2, 4],
            [0, 2, 4],
            [0, 1, 1],
            [0, 2, 3],
          ],
          0,
          4,
        ],
        expected: [0, 1, 2],
      },
      {
        args: [
          5,
          [
            [0, 4, 4],
            [3, 1, 2],
          ],
          0,
          4,
        ],
        expected: [0],
      },
      {
        args: [
          4,
          [
            [3, 2, 4],
            [1, 3, 2],
            [0, 1, 1],
            [1, 3, 2],
            [1, 0, 3],
            [3, 3, 4],
            [1, 3, 2],
          ],
          0,
          3,
        ],
        expected: [0],
      },
    ],
    88: [
      {
        args: [
          4,
          4,
          [
            [3, 0],
            [1, 0],
            [3, 0],
            [2, 2],
          ],
        ],
        expected: [
          [1, 0],
          [2, 2],
        ],
      },
      {
        args: [
          1,
          4,
          [
            [0, 0],
            [0, 3],
            [0, 3],
          ],
        ],
        expected: [[0, 0]],
      },
      {
        args: [
          4,
          3,
          [
            [3, 1],
            [2, 2],
            [0, 2],
            [1, 2],
            [1, 2],
            [1, 1],
          ],
        ],
        expected: [
          [0, 2],
          [1, 1],
        ],
      },
      {
        args: [
          2,
          1,
          [
            [0, 0],
            [0, 0],
            [1, 0],
            [1, 0],
            [0, 0],
          ],
        ],
        expected: [[0, 0]],
      },
      {
        args: [1, 1, []],
        expected: [],
      },
      {
        args: [4, 4, []],
        expected: [],
      },
      {
        args: [3, 2, []],
        expected: [],
      },
      {
        args: [
          3,
          4,
          [
            [1, 1],
            [1, 2],
            [0, 2],
            [1, 0],
            [0, 2],
            [0, 1],
            [1, 1],
          ],
        ],
        expected: [
          [0, 1],
          [1, 0],
        ],
      },
      {
        args: [
          4,
          3,
          [
            [2, 2],
            [1, 0],
            [0, 2],
            [0, 2],
          ],
        ],
        expected: [
          [0, 2],
          [1, 0],
        ],
      },
      {
        args: [2, 2, [[1, 1]]],
        expected: [[1, 1]],
      },
      {
        args: [
          3,
          4,
          [
            [2, 2],
            [2, 2],
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 1],
            [1, 2],
          ],
        ],
        expected: [
          [1, 1],
          [2, 2],
        ],
      },
      {
        args: [
          4,
          1,
          [
            [0, 0],
            [0, 0],
            [1, 0],
          ],
        ],
        expected: [[0, 0]],
      },
    ],
    89: [
      {
        args: [[6, 5, 1, 5]],
        expected: "((A0*A1)*A2)",
      },
      {
        args: [[8]],
        expected: "",
      },
      {
        args: [[3, 4, 5, 8, 7]],
        expected: "(((A0*A1)*A2)*A3)",
      },
      {
        args: [[6, 7]],
        expected: "A0",
      },
      {
        args: [[6, 4, 8]],
        expected: "(A0*A1)",
      },
      {
        args: [[6, 5]],
        expected: "A0",
      },
      {
        args: [[3, 7, 3, 4, 5]],
        expected: "(((A0*A1)*A2)*A3)",
      },
      {
        args: [[2, 3, 6, 4]],
        expected: "((A0*A1)*A2)",
      },
      {
        args: [[3, 3]],
        expected: "A0",
      },
      {
        args: [[5, 7, 8]],
        expected: "(A0*A1)",
      },
      {
        args: [[1, 2]],
        expected: "A0",
      },
      {
        args: [[8, 7, 8, 5]],
        expected: "(A0*(A1*A2))",
      },
    ],
    90: [
      {
        args: [
          {
            value: 3,
            left: {
              value: 6,
              left: null,
              right: {
                value: 1,
                left: {
                  value: 0,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: 4,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: 8,
              left: null,
              right: {
                value: 5,
                left: {
                  value: 7,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: {
              value: 0,
              left: null,
              right: {
                value: 3,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: 9,
      },
      {
        args: [
          {
            value: 8,
            left: null,
            right: {
              value: 0,
              left: {
                value: 1,
                left: null,
                right: null,
              },
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: 0,
      },
      {
        args: [
          {
            value: 7,
            left: {
              value: 3,
              left: {
                value: 2,
                left: {
                  value: 6,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        ],
        expected: 9,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: 4,
              left: {
                value: 5,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 7,
              left: {
                value: 5,
                left: {
                  value: 2,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: 12,
      },
      {
        args: [
          {
            value: 7,
            left: null,
            right: {
              value: 2,
              left: null,
              right: null,
            },
          },
        ],
        expected: 2,
      },
      {
        args: [
          {
            value: 8,
            left: null,
            right: {
              value: 7,
              left: null,
              right: {
                value: 0,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: 7,
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 5,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: 5,
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: 7,
              left: null,
              right: null,
            },
            right: {
              value: 2,
              left: null,
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: 3,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: 7,
              left: {
                value: 8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 2,
              left: null,
              right: {
                value: 2,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: 9,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: 1,
              left: {
                value: 4,
                left: null,
                right: {
                  value: 2,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: {
              value: 4,
              left: null,
              right: {
                value: 6,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: 7,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: 0,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: 0,
      },
    ],
    91: [
      {
        args: [
          [
            [0, null],
            [7, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          [
            [0, null, 7],
            [1, 0, 2],
            [null, 6, 0],
          ],
        ],
        expected: [0, 2, 1, 0],
      },
      {
        args: [
          [
            [0, 6, 5, 0],
            [0, 0, null, 4],
            [4, 7, 0, 2],
            [null, 7, 6, 0],
          ],
        ],
        expected: [0, 3, 2, 1, 0],
      },
      {
        args: [[]],
        expected: [],
      },
      {
        args: [
          [
            [0, 1],
            [0, 0],
          ],
        ],
        expected: [0, 1, 0],
      },
      {
        args: [
          [
            [0, null, null, null],
            [3, 0, null, 6],
            [0, 7, 0, 5],
            [null, 0, 4, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          [
            [0, null, null, 7, 7],
            [2, 0, 6, null, 2],
            [1, 2, 0, 3, 0],
            [1, 7, 4, 0, 5],
            [0, 7, 1, 1, 0],
          ],
        ],
        expected: [0, 3, 2, 1, 4, 0],
      },
      {
        args: [
          [
            [0, 3, null],
            [null, 0, 7],
            [1, null, 0],
          ],
        ],
        expected: [0, 1, 2, 0],
      },
      {
        args: [
          [
            [0, 2, 6, 6, 2],
            [0, 0, 4, 1, null],
            [null, 6, 0, null, 0],
            [4, 0, 3, 0, 1],
            [0, 3, 1, null, 0],
          ],
        ],
        expected: [0, 1, 3, 2, 4, 0],
      },
      {
        args: [
          [
            [0, 0],
            [null, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          [
            [0, null, null, null],
            [null, 0, 7, 1],
            [0, 2, 0, 7],
            [null, 0, 4, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          [
            [0, 6, 4, 5, null],
            [5, 0, 4, null, 3],
            [3, 3, 0, 1, 6],
            [3, 3, 7, 0, 6],
            [6, null, 7, 3, 0],
          ],
        ],
        expected: [0, 2, 1, 4, 3, 0],
      },
    ],
    92: [
      {
        args: [[-5, 1, -1, -1, 3, 2, -4]],
        expected: [-5, 1, 3],
      },
      {
        args: [[5, 0, 3, -5, 5, 3, 5]],
        expected: [0, 3, 5],
      },
      {
        args: [[0]],
        expected: [0],
      },
      {
        args: [[-3, 5, 2, -4, 3, -4, 0]],
        expected: [-3, 2, 3],
      },
      {
        args: [[5, -2, 0, 3, 0]],
        expected: [-2, 0, 3],
      },
      {
        args: [[-2, -3, -2, -1, -3, -5, -2]],
        expected: [-3, -2, -1],
      },
      {
        args: [[1]],
        expected: [1],
      },
      {
        args: [[-4]],
        expected: [-4],
      },
      {
        args: [[-5]],
        expected: [-5],
      },
      {
        args: [[-5, 3, 5, -3]],
        expected: [-5, 3, 5],
      },
      {
        args: [[5, 0, -5]],
        expected: [5],
      },
      {
        args: [[3, -1, 3, 5, -4, 3, -5]],
        expected: [-1, 3, 5],
      },
    ],
    93: [
      {
        args: [[], 6],
        expected: [],
      },
      {
        args: [[2, 0], 9],
        expected: [],
      },
      {
        args: [[-2], 2],
        expected: [],
      },
      {
        args: [[3, 4, -3, -1, -3, -3, 4], 5],
        expected: [-3, -3, -3],
      },
      {
        args: [[5, 5, 1, 3], 8],
        expected: [],
      },
      {
        args: [[3], 4],
        expected: [],
      },
      {
        args: [[0, -5, -5, -4, -3, 4], 8],
        expected: [],
      },
      {
        args: [[-1, 0, -5], 5],
        expected: [],
      },
      {
        args: [[-5, -4], 4],
        expected: [],
      },
      {
        args: [[], -1],
        expected: [],
      },
      {
        args: [[], 9],
        expected: [],
      },
      {
        args: [[-4, 5, -5], 6],
        expected: [],
      },
    ],
    94: [
      {
        args: [
          [
            [3, 5],
            [-1, 1],
            [-4, -2],
            [2, 4],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [-1, 4],
            [0, 6],
            [0, 5],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [
            [-1, 4],
            [1, 6],
            [-3, 4],
            [-1, 2],
            [-4, 4],
          ],
        ],
        expected: 5,
      },
      {
        args: [[[-2, 1]]],
        expected: 1,
      },
      {
        args: [
          [
            [-3, 0],
            [-4, -2],
            [4, 4],
            [-2, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [2, 4],
            [-4, -1],
            [-3, 5],
            [3, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [0, 5],
            [4, 5],
            [-4, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [0, 4],
            [-1, -1],
            [1, 1],
            [5, 5],
            [2, 5],
          ],
        ],
        expected: 2,
      },
      {
        args: [[[-3, 5]]],
        expected: 1,
      },
      {
        args: [
          [
            [2, 2],
            [-2, 5],
            [-4, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [[[-2, 0]]],
        expected: 1,
      },
      {
        args: [
          [
            [-1, 3],
            [-2, -1],
            [1, 1],
            [2, 3],
          ],
        ],
        expected: 2,
      },
    ],
    95: [
      {
        args: [0],
        expected: [],
      },
      {
        args: [3],
        expected: [],
      },
      {
        args: [5],
        expected: [0, 2, 4, 1, 3],
      },
      {
        args: [6],
        expected: [1, 3, 5, 0, 2, 4],
      },
      {
        args: [7],
        expected: [0, 2, 4, 6, 1, 3, 5],
      },
      {
        args: [8],
        expected: [0, 4, 7, 5, 2, 6, 1, 3],
      },
    ],
    96: [
      {
        args: [-1, 13, 12],
        expected: 1,
      },
      {
        args: [2, 12, 11],
        expected: 3,
      },
      {
        args: [-4, 11, 12],
        expected: 1,
      },
      {
        args: [-3, 19, 3],
        expected: 1,
      },
      {
        args: [2, 6, 11],
        expected: 8,
      },
      {
        args: [0, 17, 13],
        expected: 1,
      },
      {
        args: [-3, 17, 7],
        expected: 5,
      },
      {
        args: [-2, 19, 2],
        expected: 1,
      },
      {
        args: [-1, 5, 7],
        expected: 1,
      },
      {
        args: [-2, 8, 3],
        expected: 2,
      },
      {
        args: [-3, 12, 13],
        expected: 0,
      },
      {
        args: [-1, 2, 6],
        expected: 0,
      },
    ],
    97: [
      {
        args: [19],
        expected: [0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19],
      },
      {
        args: [52],
        expected: [
          0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2, 5, 2, 37, 2, 3, 2, 41, 2,
          43, 2, 3, 2, 47, 2, 7, 2, 3, 2,
        ],
      },
      {
        args: [3],
        expected: [0, 0, 2, 3],
      },
      {
        args: [43],
        expected: [
          0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2, 5, 2, 37, 2, 3, 2, 41, 2,
          43,
        ],
      },
      {
        args: [69],
        expected: [
          0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2, 5, 2, 37, 2, 3, 2, 41, 2,
          43, 2, 3, 2, 47, 2, 7, 2, 3, 2, 53, 2, 5, 2, 3, 2, 59, 2, 61, 2, 3, 2, 5, 2, 67, 2, 3,
        ],
      },
      {
        args: [80],
        expected: [
          0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2, 5, 2, 37, 2, 3, 2, 41, 2,
          43, 2, 3, 2, 47, 2, 7, 2, 3, 2, 53, 2, 5, 2, 3, 2, 59, 2, 61, 2, 3, 2, 5, 2, 67, 2, 3, 2, 71, 2, 73, 2, 3, 2, 7, 2, 79, 2,
        ],
      },
      {
        args: [42],
        expected: [
          0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2, 5, 2, 37, 2, 3, 2, 41, 2,
        ],
      },
      {
        args: [36],
        expected: [0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2, 5, 2],
      },
      {
        args: [59],
        expected: [
          0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2, 5, 2, 37, 2, 3, 2, 41, 2,
          43, 2, 3, 2, 47, 2, 7, 2, 3, 2, 53, 2, 5, 2, 3, 2, 59,
        ],
      },
      {
        args: [13],
        expected: [0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13],
      },
      {
        args: [72],
        expected: [
          0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2, 5, 2, 37, 2, 3, 2, 41, 2,
          43, 2, 3, 2, 47, 2, 7, 2, 3, 2, 53, 2, 5, 2, 3, 2, 59, 2, 61, 2, 3, 2, 5, 2, 67, 2, 3, 2, 71, 2,
        ],
      },
      {
        args: [34],
        expected: [0, 0, 2, 3, 2, 5, 2, 7, 2, 3, 2, 11, 2, 13, 2, 3, 2, 17, 2, 19, 2, 3, 2, 23, 2, 5, 2, 3, 2, 29, 2, 31, 2, 3, 2],
      },
    ],
    98: [
      {
        args: [2, 1, 2],
        expected: [],
      },
      {
        args: [6, 3, 16],
        expected: [2, 3, 4],
      },
      {
        args: [5, 4, 2],
        expected: [0, 1, 3, 4],
      },
      {
        args: [7, 3, 29],
        expected: [2, 4, 6],
      },
      {
        args: [2, 1, 3],
        expected: [],
      },
      {
        args: [1, 1, 2],
        expected: [],
      },
      {
        args: [5, 1, 6],
        expected: [],
      },
      {
        args: [8, 1, 0],
        expected: [0],
      },
      {
        args: [7, 6, 8],
        expected: [],
      },
      {
        args: [7, 1, 5],
        expected: [5],
      },
      {
        args: [4, 4, 0],
        expected: [0, 1, 2, 3],
      },
      {
        args: [4, 1, 3],
        expected: [3],
      },
    ],
    99: [
      {
        args: [[-1, 1, 3, 3, -5], 21],
        expected: [-1, -5, 3, 3, 1],
      },
      {
        args: [[5], 10],
        expected: [5],
      },
      {
        args: [[-5, -5, 4], 46],
        expected: [4, -5, -5],
      },
      {
        args: [[3, 1, 2], 64],
        expected: [2, 3, 1],
      },
      {
        args: [[-5, 1], 94],
        expected: [1, -5],
      },
      {
        args: [[-5, 5, 5, -3, -2, 4, -2], 91],
        expected: [-2, 5, -3, 4, 5, -2, -5],
      },
      {
        args: [[-5, 5, -4], 48],
        expected: [-5, 5, -4],
      },
      {
        args: [[-4, 4, 1, 2, -3, -4, 5], 17],
        expected: [-4, -4, 4, 5, 1, 2, -3],
      },
      {
        args: [[2, -4, -3, -1], 17],
        expected: [2, -3, -4, -1],
      },
      {
        args: [[-1, -4], 73],
        expected: [-1, -4],
      },
      {
        args: [[], 29],
        expected: [],
      },
      {
        args: [[-4, 0, -4, -3, -5, 1], 36],
        expected: [1, -3, 0, -5, -4, -4],
      },
    ],
    100: [
      {
        args: [
          5,
          [
            [3, 3],
            [1, 2],
            [3, 2],
            [1, 2],
            [4, 3],
          ],
          [1],
        ],
        expected: false,
      },
      {
        args: [0, [], [0, -1]],
        expected: false,
      },
      {
        args: [1, [[0, 0]], [1, 0, 1]],
        expected: false,
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 0],
          ],
          [-1],
        ],
        expected: false,
      },
      {
        args: [
          3,
          [
            [0, 1],
            [2, 1],
            [0, 0],
            [1, 1],
            [1, 1],
            [1, 1],
          ],
          [2, 1],
        ],
        expected: false,
      },
      {
        args: [2, [], []],
        expected: true,
      },
      {
        args: [0, [], [0, 0, -1]],
        expected: false,
      },
      {
        args: [3, [[1, 2]], [2, 2]],
        expected: false,
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 0],
            [1, 0],
            [1, 1],
            [1, 0],
            [0, 1],
          ],
          [1, 0, -1],
        ],
        expected: false,
      },
      {
        args: [0, [], [0]],
        expected: false,
      },
      {
        args: [
          4,
          [
            [0, 0],
            [3, 0],
            [0, 2],
            [2, 1],
            [0, 3],
            [0, 2],
          ],
          [],
        ],
        expected: false,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          [0],
        ],
        expected: true,
      },
    ],
    101: [
      {
        args: [
          2,
          [
            [1, 0],
            [0, 1],
            [0, 1],
            [1, 0],
          ],
        ],
        expected: [0],
      },
      {
        args: [1, []],
        expected: [],
      },
      {
        args: [2, []],
        expected: [],
      },
      {
        args: [
          4,
          [
            [1, 2],
            [1, 2],
          ],
        ],
        expected: [1],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [0, 1],
          ],
        ],
        expected: [0],
      },
      {
        args: [
          5,
          [
            [0, 3],
            [3, 2],
            [2, 3],
            [2, 3],
            [4, 1],
          ],
        ],
        expected: [1, 3],
      },
      {
        args: [
          3,
          [
            [1, 2],
            [1, 0],
          ],
        ],
        expected: [1],
      },
      {
        args: [
          4,
          [
            [1, 0],
            [2, 3],
            [3, 1],
          ],
        ],
        expected: [1, 2],
      },
      {
        args: [2, [[1, 0]]],
        expected: [0],
      },
      {
        args: [
          4,
          [
            [1, 2],
            [3, 2],
          ],
        ],
        expected: [2],
      },
      {
        args: [3, [[1, 2]]],
        expected: [1],
      },
      {
        args: [
          2,
          [
            [0, 1],
            [0, 1],
            [0, 1],
          ],
        ],
        expected: [0],
      },
    ],
    102: [
      {
        args: [
          [
            [0, 2, 1],
            [-2, 6, 0],
            [-1, 0, -1],
          ],
        ],
        expected: [0],
      },
      {
        args: [
          [
            [0, 5, -3],
            [-2, 0, 7],
          ],
        ],
        expected: [1],
      },
      {
        args: [
          [
            [-3, -1, 1],
            [-4, 0, 9],
            [-4, 6, 9],
          ],
        ],
        expected: [1],
      },
      {
        args: [
          [
            [6, 7, -3],
            [-2, 0, -1],
          ],
        ],
        expected: [],
      },
      {
        args: [
          [
            [-3, 3, 6],
            [-3, 2, -2],
            [-4, 2, 4],
            [-1, 7, 1],
          ],
        ],
        expected: [0],
      },
      {
        args: [[[-3, 0, 5]]],
        expected: [0],
      },
      {
        args: [
          [
            [-4, 1, -3],
            [-4, -3, -1],
            [2, 5, 1],
          ],
        ],
        expected: [2],
      },
      {
        args: [
          [
            [-3, 7, 0],
            [-3, 7, 3],
            [0, 4, -1],
            [4, 6, -2],
          ],
        ],
        expected: [1],
      },
      {
        args: [
          [
            [-1, 5, -1],
            [-1, 2, -2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          [
            [-2, 3, -3],
            [-4, -1, 8],
            [-4, -1, -3],
            [3, 5, 6],
            [-3, 6, -1],
          ],
        ],
        expected: [1, 3],
      },
      {
        args: [
          [
            [0, 6, 4],
            [3, 7, 0],
          ],
        ],
        expected: [0],
      },
      {
        args: [
          [
            [-2, 0, 4],
            [1, 5, 8],
            [-2, 0, 2],
          ],
        ],
        expected: [0, 1],
      },
    ],
    103: [
      {
        args: ["AB", ""],
        expected: 0,
      },
      {
        args: ["aa", "ABAA"],
        expected: 0,
      },
      {
        args: ["B", "Aa"],
        expected: 0,
      },
      {
        args: ["BbAA", "bABaa"],
        expected: 2,
      },
      {
        args: ["A", "BABa"],
        expected: 1,
      },
      {
        args: ["bBbbA", "AAA"],
        expected: 1,
      },
      {
        args: ["", "Bba"],
        expected: 0,
      },
      {
        args: ["baA", "a"],
        expected: 1,
      },
      {
        args: ["bbbAB", "baba"],
        expected: 1,
      },
      {
        args: ["bbBAa", "AAaabA"],
        expected: 2,
      },
      {
        args: ["bAAaAA", ""],
        expected: 0,
      },
      {
        args: ["Bbaba", "BaaBa"],
        expected: 1,
      },
    ],
    104: [
      {
        args: [
          2,
          [
            [0, 1],
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
          0,
          0,
        ],
        expected: 0,
      },
      {
        args: [
          5,
          [
            [0, 4],
            [1, 3],
            [3, 2],
            [4, 1],
          ],
          0,
          2,
        ],
        expected: 0,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          0,
          0,
        ],
        expected: 0,
      },
      {
        args: [3, [], 0, 2],
        expected: -1,
      },
      {
        args: [4, [], 2, 1],
        expected: -1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          0,
          0,
        ],
        expected: 0,
      },
      {
        args: [5, [], 4, 3],
        expected: -1,
      },
      {
        args: [
          2,
          [
            [0, 1],
            [0, 1],
          ],
          0,
          1,
        ],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [1, 1],
            [1, 1],
          ],
          0,
          0,
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [2, 0],
            [1, 1],
            [2, 2],
          ],
          0,
          2,
        ],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          0,
          0,
        ],
        expected: 0,
      },
      {
        args: [
          5,
          [
            [0, 0],
            [3, 0],
            [1, 0],
          ],
          0,
          1,
        ],
        expected: 1,
      },
    ],
    105: [
      {
        args: [0, 8, 3],
        expected: 0,
      },
      {
        args: [3, 4, 17],
        expected: 1,
      },
      {
        args: [-1, -1, 14],
        expected: 1,
      },
      {
        args: [4, -3, 19],
        expected: 1,
      },
      {
        args: [-1, 5, 8],
        expected: 1,
      },
      {
        args: [-4, -9, 6],
        expected: 0,
      },
      {
        args: [-1, 9, 8],
        expected: 1,
      },
      {
        args: [-9, 5, 6],
        expected: 0,
      },
      {
        args: [-5, 4, 12],
        expected: 1,
      },
      {
        args: [7, -3, 9],
        expected: 1,
      },
      {
        args: [-2, 2, 14],
        expected: 2,
      },
      {
        args: [0, 5, 6],
        expected: 0,
      },
    ],
    106: [
      {
        args: [[[3, 3]], [4, 1]],
        expected: false,
      },
      {
        args: [[], [2, 0]],
        expected: false,
      },
      {
        args: [
          [
            [-3, -2],
            [-2, 3],
          ],
          [3, 4],
        ],
        expected: false,
      },
      {
        args: [[[2, -2]], [-1, 0]],
        expected: false,
      },
      {
        args: [
          [
            [-2, 3],
            [-1, -3],
            [2, 2],
            [1, 3],
          ],
          [-3, 2],
        ],
        expected: false,
      },
      {
        args: [
          [
            [-3, -2],
            [2, 1],
            [3, 2],
            [3, 3],
            [-1, 3],
          ],
          [4, -1],
        ],
        expected: false,
      },
      {
        args: [
          [
            [-3, -3],
            [-2, -3],
            [3, -2],
            [-1, 2],
            [-3, -1],
          ],
          [0, -1],
        ],
        expected: true,
      },
      {
        args: [
          [
            [-3, 2],
            [-1, -3],
            [2, -1],
            [2, 2],
            [1, 3],
          ],
          [-3, -4],
        ],
        expected: false,
      },
      {
        args: [
          [
            [-1, -3],
            [2, 1],
            [-1, 0],
          ],
          [-4, -4],
        ],
        expected: false,
      },
      {
        args: [
          [
            [-3, 2],
            [0, -2],
            [1, 2],
          ],
          [2, -4],
        ],
        expected: false,
      },
      {
        args: [[], [2, -4]],
        expected: false,
      },
      {
        args: [[], [-4, -3]],
        expected: false,
      },
    ],
    107: [
      {
        args: ["b+aa", "aa"],
        expected: [2],
      },
      {
        args: ["Æa", "a"],
        expected: [1],
      },
      {
        args: ["aaAb", "b"],
        expected: [3],
      },
      {
        args: ["b", "BabAbB"],
        expected: [],
      },
      {
        args: ["", "abbB"],
        expected: [],
      },
      {
        args: ["aaa", "ABBbBa"],
        expected: [],
      },
      {
        args: ["BABA", "baaAa"],
        expected: [],
      },
      {
        args: ["bA", "a"],
        expected: [],
      },
      {
        args: ["bAAbB", "a"],
        expected: [],
      },
      {
        args: ["bb", "AB"],
        expected: [],
      },
      {
        args: ["ABAAb", "BAabba"],
        expected: [],
      },
      {
        args: ["", "bb"],
        expected: [],
      },
    ],
  },
  transfer: {
    0: [
      {
        args: [[-1, 1, -2], 3],
        expected: 2,
      },
      {
        args: [[0, 0], 3],
        expected: 1,
      },
      {
        args: [[-2, 0, -2, 0], -3],
        expected: -1,
      },
      {
        args: [[], 0],
        expected: -1,
      },
      {
        args: [[0, 0], 0],
        expected: -1,
      },
      {
        args: [[3, -1, 2, -1], 1],
        expected: 3,
      },
      {
        args: [[-2, -2, 0, -2, -3], 3],
        expected: 4,
      },
      {
        args: [[3, 3, -2, 1, 3, 0], 1],
        expected: 5,
      },
      {
        args: [[1, 2], -3],
        expected: -1,
      },
      {
        args: [[0, 0, 2, -2, 3, -3], -1],
        expected: 5,
      },
      {
        args: [[1, 0, -2, 3, 3], 1],
        expected: 2,
      },
      {
        args: [[1], 4],
        expected: 0,
      },
    ],
    1: [
      {
        args: [[-4, 0, -3]],
        expected: [-4, -4, -7],
      },
      {
        args: [[-5, 5, 5, -1, -5, -5, 2]],
        expected: [-5, 0, 5, 4, -1, -6, -4],
      },
      {
        args: [[4, 0, 1]],
        expected: [4, 4, 5],
      },
      {
        args: [[-1, 5, -1, 1, -3]],
        expected: [-1, 4, 3, 4, 1],
      },
      {
        args: [[-2, -4, 1, 3, 1, -4, -5]],
        expected: [-2, -6, -5, -2, -1, -5, -10],
      },
      {
        args: [[2]],
        expected: [2],
      },
      {
        args: [[-1, -2, -3, 2, 1, 5]],
        expected: [-1, -3, -6, -4, -3, 2],
      },
      {
        args: [[5, -4, 5, 2, 0, -1, 0]],
        expected: [5, 1, 6, 8, 8, 7, 7],
      },
      {
        args: [[3]],
        expected: [3],
      },
      {
        args: [[1, -5, 1, -5, 3, 4]],
        expected: [1, -4, -3, -8, -5, -1],
      },
      {
        args: [[-4, 0, -4, -5, 2, -2]],
        expected: [-4, -4, -8, -13, -11, -13],
      },
      {
        args: [[3, -2, -1, -3, -1, -1]],
        expected: [3, 1, 0, -3, -4, -5],
      },
    ],
    3: [
      {
        args: ["éA0"],
        expected: false,
      },
      {
        args: ["bé1b1ab"],
        expected: false,
      },
      {
        args: ["011"],
        expected: false,
      },
      {
        args: ["Bbb"],
        expected: true,
      },
      {
        args: ["ab1!0a"],
        expected: false,
      },
      {
        args: ["!BbB"],
        expected: true,
      },
      {
        args: ["!!Ab0aA"],
        expected: false,
      },
      {
        args: ["bAéA010"],
        expected: false,
      },
      {
        args: ["0bbBb"],
        expected: false,
      },
      {
        args: ["0A"],
        expected: false,
      },
      {
        args: [""],
        expected: true,
      },
      {
        args: ["aA11"],
        expected: false,
      },
    ],
    4: [
      {
        args: [[-3, -5, 1], 4, -4],
        expected: 0,
      },
      {
        args: [[3, -3, 4, 5], 1, 3],
        expected: 3,
      },
      {
        args: [[2, -3, 3], 0, 3],
        expected: 0,
      },
      {
        args: [[-5, -5, -1, 5, 2], 5, 0],
        expected: 0,
      },
      {
        args: [[2, 0, 4], 2, 0],
        expected: 2,
      },
      {
        args: [[-3, 4, -5, 2, -1], 2, 4],
        expected: 0,
      },
      {
        args: [[3, 0], 2, 1],
        expected: 1,
      },
      {
        args: [[1, 2, -5, 0, -1, -3, 2], 2, -2],
        expected: 5,
      },
      {
        args: [[-4, -2, 1, 3], 6, -1],
        expected: 0,
      },
      {
        args: [[], 0, 4],
        expected: 0,
      },
      {
        args: [[-2], 2, -1],
        expected: 0,
      },
      {
        args: [[-2, 4, -4], -1, -1],
        expected: 0,
      },
    ],
    5: [
      {
        args: [[4, 1, 5, 3]],
        expected: -1,
      },
      {
        args: [[-5, -1, 2, -3, 0, 2, -2]],
        expected: -1,
      },
      {
        args: [[0, -2, 2]],
        expected: 0,
      },
      {
        args: [[3, -2]],
        expected: -1,
      },
      {
        args: [[-4, 5, -5, -5, 4, 0, -2]],
        expected: -1,
      },
      {
        args: [[-5, -5, 2, -4, 5]],
        expected: -1,
      },
      {
        args: [[-3, -4, 3, 0]],
        expected: -1,
      },
      {
        args: [[-4]],
        expected: 0,
      },
      {
        args: [[4, -5, -3]],
        expected: -1,
      },
      {
        args: [[4, 0, 1, -5]],
        expected: -1,
      },
      {
        args: [[5, 3, -3, -5, 1]],
        expected: 4,
      },
      {
        args: [[1, 5, 4, -3, -4]],
        expected: -1,
      },
    ],
    6: [
      {
        args: [[0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
        expected: 1,
      },
      {
        args: [[0, 1, 2, 3, 4, 6, 7, 8, 9, 10]],
        expected: 5,
      },
      {
        args: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
        expected: 9,
      },
      {
        args: [[0]],
        expected: 1,
      },
      {
        args: [[0, 1, 3, 4, 5]],
        expected: 2,
      },
      {
        args: [[0, 1, 2, 4, 5]],
        expected: 3,
      },
      {
        args: [[0, 1, 2, 4, 5, 6, 7, 8, 9]],
        expected: 3,
      },
      {
        args: [[0, 1, 2, 3, 4, 6]],
        expected: 5,
      },
      {
        args: [[0, 1, 2, 4, 5, 6, 7, 8]],
        expected: 3,
      },
      {
        args: [[1]],
        expected: 0,
      },
      {
        args: [[0, 1, 2, 3, 4, 5, 6]],
        expected: 7,
      },
      {
        args: [[0, 1, 2, 3, 4, 5, 6, 7, 9, 10]],
        expected: 8,
      },
    ],
    9: [
      {
        args: ["1b"],
        expected: "1b",
      },
      {
        args: ["aéB"],
        expected: "aéB",
      },
      {
        args: ["a0ab10a"],
        expected: "a0ab10a",
      },
      {
        args: ["BaA!"],
        expected: "BaA!",
      },
      {
        args: ["béBa0Ba"],
        expected: "béBa0Ba",
      },
      {
        args: ["!bbB0!0"],
        expected: "!B0!0",
      },
      {
        args: ["éa1!b"],
        expected: "éa1!b",
      },
      {
        args: ["0AB"],
        expected: "0AB",
      },
      {
        args: ["éé"],
        expected: "",
      },
      {
        args: ["10a"],
        expected: "10a",
      },
      {
        args: ["!!0bbb"],
        expected: "0b",
      },
      {
        args: ["!BB1"],
        expected: "!1",
      },
    ],
    12: [
      {
        args: [["a", "A", "ab", "a", "ab"]],
        expected: "a",
      },
      {
        args: [["", "a", "b", "A", "a", ""]],
        expected: "",
      },
      {
        args: [["A", "a"]],
        expected: "A",
      },
      {
        args: [["A", "a", "", "A", "a", "ab"]],
        expected: "A",
      },
      {
        args: [["a"]],
        expected: "a",
      },
      {
        args: [["A", "a", "a"]],
        expected: "a",
      },
      {
        args: [["a", "b", ""]],
        expected: "",
      },
      {
        args: [["A", "A", "ab", "A", "a"]],
        expected: "A",
      },
      {
        args: [["A", "A", "ab", "A"]],
        expected: "A",
      },
      {
        args: [["", "a", "b", "a", "ab"]],
        expected: "a",
      },
      {
        args: [["ab", "A", "a"]],
        expected: "A",
      },
      {
        args: [["b"]],
        expected: "b",
      },
    ],
    13: [
      {
        args: [[3, 3, 3, 3], 6],
        expected: 6,
      },
      {
        args: [[0, 0, 0], 0],
        expected: 3,
      },
      {
        args: [[-3, -2, 0, 1, -2, -2], 3],
        expected: 0,
      },
      {
        args: [[2, -2], 2],
        expected: 0,
      },
      {
        args: [[1, -2, -1, 1, -3, 0], 2],
        expected: 1,
      },
      {
        args: [[0, -2], -4],
        expected: 0,
      },
      {
        args: [[-1, 3, 0], 1],
        expected: 0,
      },
      {
        args: [[1, -1, 0, -3, -3, -2], 2],
        expected: 0,
      },
      {
        args: [[0, 1], -3],
        expected: 0,
      },
      {
        args: [[], 2],
        expected: 0,
      },
      {
        args: [[0, -2, -3, 3], 0],
        expected: 1,
      },
      {
        args: [[-2], 0],
        expected: 0,
      },
    ],
    14: [
      {
        args: [-1, 4],
        expected: 1,
      },
      {
        args: [5, 1],
        expected: 5,
      },
      {
        args: [4, 8],
        expected: 65536,
      },
      {
        args: [1, 9],
        expected: 1,
      },
      {
        args: [-5, 4],
        expected: 625,
      },
      {
        args: [0, 1],
        expected: 0,
      },
      {
        args: [-4, 2],
        expected: 16,
      },
      {
        args: [2, 1],
        expected: 2,
      },
      {
        args: [-5, 3],
        expected: -125,
      },
      {
        args: [0, 6],
        expected: 0,
      },
      {
        args: [-4, 0],
        expected: 1,
      },
      {
        args: [-4, 6],
        expected: 4096,
      },
    ],
    17: [
      {
        args: [[[], [], []]],
        expected: [],
      },
      {
        args: [[[1], [], []]],
        expected: [1],
      },
      {
        args: [[[0, 3], [1, 1, 2, 3], []]],
        expected: [0, 1, 1, 2, 3, 3],
      },
      {
        args: [[[-2, -2], [2], []]],
        expected: [-2, -2, 2],
      },
      {
        args: [[[-3, 1], [-3, -2, -1, 3], []]],
        expected: [-3, -3, -2, -1, 1, 3],
      },
      {
        args: [[[2, 3], [-3, 0], []]],
        expected: [-3, 0, 2, 3],
      },
      {
        args: [[[-1, 1], [-2, 2, 3], []]],
        expected: [-2, -1, 1, 2, 3],
      },
      {
        args: [[[1, 3], [-1], []]],
        expected: [-1, 1, 3],
      },
      {
        args: [[[2, 3], [-3, -3, 1], []]],
        expected: [-3, -3, 1, 2, 3],
      },
      {
        args: [[[-2], [], []]],
        expected: [-2],
      },
      {
        args: [[[-1, 0], [-1, -1, 3], []]],
        expected: [-1, -1, -1, 0, 3],
      },
      {
        args: [[[-1, 1], [2, 2], []]],
        expected: [-1, 1, 2, 2],
      },
    ],
    18: [
      {
        args: [[[0, 0, 1]]],
        expected: -1,
      },
      {
        args: [
          [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0],
            [1, 1, 0],
          ],
        ],
        expected: 5,
      },
      {
        args: [
          [
            [1, 1, 1],
            [0, 0, 0],
            [0, 0, 1],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [
            [0, 1, 0],
            [0, 0, 0],
            [1, 1, 1],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [
            [1, 0, 0],
            [1, 0, 0],
            [0, 0, 1],
            [1, 1, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [
            [1, 0, 1],
            [1, 0, 1],
          ],
        ],
        expected: -1,
      },
      {
        args: [[[1, 1, 1]]],
        expected: -1,
      },
      {
        args: [
          [
            [1, 0, 0],
            [0, 1, 1],
            [0, 1, 0],
          ],
        ],
        expected: -1,
      },
      {
        args: [[[1, 1, 0]]],
        expected: -1,
      },
      {
        args: [
          [
            [0, 0, 1],
            [0, 0, 0],
            [0, 1, 0],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 1],
            [1, 0, 1],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [
            [1, 1, 0],
            [1, 0, 0],
          ],
        ],
        expected: -1,
      },
    ],
    20: [
      {
        args: [
          [
            [5, 9],
            [3, 8],
            [4, 11],
            [-4, -3],
            [3, 10],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          [
            [1, 3],
            [2, 4],
            [-1, 4],
            [-1, 4],
            [0, 4],
          ],
        ],
        expected: 5,
      },
      {
        args: [
          [
            [-5, 1],
            [-5, 0],
            [0, 2],
            [1, 2],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [2, 6],
            [0, 2],
            [-5, 2],
            [3, 5],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [4, 8],
            [3, 6],
            [-2, 0],
            [-5, 2],
            [1, 6],
            [0, 3],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [
            [-4, 1],
            [-3, 4],
            [-4, -3],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [5, 11],
            [3, 6],
            [2, 5],
            [-3, -1],
            [-2, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [-5, -4],
            [-1, 5],
            [-2, 2],
            [1, 6],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [
            [1, 4],
            [-4, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [-4, -3],
            [4, 5],
            [-4, -3],
            [0, 4],
            [5, 12],
            [-3, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [-3, 3],
            [-4, 1],
            [5, 9],
            [0, 2],
            [-2, 4],
            [4, 10],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          [
            [-3, 1],
            [1, 2],
            [-5, 0],
            [-5, -3],
            [-1, 6],
          ],
        ],
        expected: 3,
      },
    ],
    22: [
      {
        args: [6],
        expected: 3,
      },
      {
        args: [32],
        expected: 2,
      },
      {
        args: [56],
        expected: 3,
      },
      {
        args: [8],
        expected: 2,
      },
      {
        args: [14],
        expected: 3,
      },
      {
        args: [19],
        expected: 3,
      },
      {
        args: [9],
        expected: 1,
      },
      {
        args: [52],
        expected: 2,
      },
      {
        args: [26],
        expected: 2,
      },
      {
        args: [57],
        expected: 3,
      },
      {
        args: [40],
        expected: 2,
      },
      {
        args: [23],
        expected: 4,
      },
    ],
    27: [
      {
        args: [["a", "b", "a", "ab", "ab", ""], "z"],
        expected: [],
      },
      {
        args: [["ab", "b"], "a"],
        expected: ["ab"],
      },
      {
        args: [["ab", "a", "a", "a", "a"], "ab"],
        expected: ["ab"],
      },
      {
        args: [["a", "a", "a"], "z"],
        expected: [],
      },
      {
        args: [["", "a", "a", "ab", "ab"], "a"],
        expected: ["a", "ab"],
      },
      {
        args: [["b", "a"], "z"],
        expected: [],
      },
      {
        args: [["a", "a"], "ab"],
        expected: [],
      },
      {
        args: [["a", "", "", "", "b", "a"], ""],
        expected: ["", "a", "b"],
      },
      {
        args: [[], "ab"],
        expected: [],
      },
      {
        args: [["", "ab"], "ab"],
        expected: ["ab"],
      },
      {
        args: [["a", "", ""], "z"],
        expected: [],
      },
      {
        args: [[], ""],
        expected: [],
      },
    ],
    28: [
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [0, 3],
            [1, 0],
            [3, 0],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [0, 1],
            [2, 3],
            [2, 3],
            [2, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          2,
          [
            [1, 1],
            [0, 1],
            [1, 1],
            [0, 1],
            [0, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          5,
          [
            [4, 4],
            [2, 1],
            [4, 3],
            [0, 2],
            [4, 1],
          ],
        ],
        expected: 5,
      },
      {
        args: [
          4,
          [
            [3, 1],
            [1, 1],
            [2, 3],
            [1, 0],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          3,
          [
            [0, 0],
            [1, 0],
            [1, 0],
            [2, 1],
            [1, 0],
            [1, 2],
            [2, 2],
            [1, 1],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [3, 2],
            [1, 2],
            [0, 2],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          3,
          [
            [2, 1],
            [1, 2],
            [0, 0],
            [0, 1],
            [0, 0],
            [2, 0],
            [1, 2],
            [1, 2],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          4,
          [
            [3, 1],
            [2, 3],
          ],
        ],
        expected: 3,
      },
    ],
    30: [
      {
        args: [[[], [], [], []]],
        expected: 0,
      },
      {
        args: [
          [
            [5, 5],
            [0, 4],
            [3, 0],
          ],
        ],
        expected: 8,
      },
      {
        args: [
          [
            [2, 3, 1, 4],
            [5, 0, 1, 1],
            [5, 2, 0, 3],
            [0, 3, 5, 4],
          ],
        ],
        expected: 13,
      },
      {
        args: [
          [
            [4, 1, 0, 0],
            [0, 5, 0, 4],
          ],
        ],
        expected: 9,
      },
      {
        args: [[[0], [1]]],
        expected: 1,
      },
      {
        args: [[[5, 0, 0]]],
        expected: 5,
      },
      {
        args: [[[2, 1]]],
        expected: 3,
      },
      {
        args: [[[5, 1, 5]]],
        expected: 11,
      },
      {
        args: [[[1, 5, 3]]],
        expected: 9,
      },
      {
        args: [
          [
            [3, 1, 0, 0],
            [3, 1, 3, 1],
            [1, 0, 3, 5],
            [0, 2, 0, 2],
          ],
        ],
        expected: 9,
      },
      {
        args: [
          [
            [2, 1, 5],
            [2, 5, 5],
            [5, 1, 5],
            [0, 3, 3],
          ],
        ],
        expected: 15,
      },
      {
        args: [[[4], [2]]],
        expected: 6,
      },
    ],
    33: [
      {
        args: ["b!", "aAAB"],
        expected: 6,
      },
      {
        args: ["", "éa1é"],
        expected: 4,
      },
      {
        args: ["!BéB00B", "00b!!Aa"],
        expected: 12,
      },
      {
        args: ["bb", "a0bA!b!"],
        expected: 7,
      },
      {
        args: ["AB0a", "b!a!"],
        expected: 7,
      },
      {
        args: ["A", "!éB"],
        expected: 4,
      },
      {
        args: ["a!é", "Aa1"],
        expected: 5,
      },
      {
        args: ["!é1001", "AABa"],
        expected: 10,
      },
      {
        args: ["A0", "é0bb1"],
        expected: 6,
      },
      {
        args: ["01", "a"],
        expected: 3,
      },
      {
        args: ["1bA11", "é!"],
        expected: 7,
      },
      {
        args: ["!0", "a"],
        expected: 3,
      },
    ],
    43: [
      {
        args: ["b", 0],
        expected: 0,
      },
      {
        args: ["Aaa", 3],
        expected: 0,
      },
      {
        args: ["bbbba", 6],
        expected: 0,
      },
      {
        args: ["bbA", 6],
        expected: 0,
      },
      {
        args: ["", 6],
        expected: 0,
      },
      {
        args: ["baaAa", 6],
        expected: 0,
      },
      {
        args: ["bbb", 1],
        expected: 3,
      },
      {
        args: ["A", -1],
        expected: 0,
      },
      {
        args: ["", 4],
        expected: 0,
      },
      {
        args: ["AabA", 4],
        expected: 0,
      },
      {
        args: ["A", 7],
        expected: 0,
      },
      {
        args: ["aA", -1],
        expected: 0,
      },
    ],
    45: [
      {
        args: [
          [-3, -3, -2, 2, 3],
          [
            [0, 1],
            [0, 3],
            [0, 1],
          ],
        ],
        expected: [0, 2, 0],
      },
      {
        args: [
          [0, 0, 3],
          [
            [3, 4],
            [0, 3],
            [-3, 3],
          ],
        ],
        expected: [1, 3, 3],
      },
      {
        args: [
          [-1, 0, 2, 2, 2],
          [
            [-1, 0],
            [0, 4],
            [-1, 0],
          ],
        ],
        expected: [2, 4, 2],
      },
      {
        args: [
          [],
          [
            [-1, 0],
            [-1, 0],
            [-3, -1],
          ],
        ],
        expected: [0, 0, 0],
      },
      {
        args: [
          [-2, 2],
          [
            [2, 3],
            [0, 3],
            [3, 3],
          ],
        ],
        expected: [1, 1, 0],
      },
      {
        args: [
          [-3, -1, 1, 3, 3],
          [
            [1, 3],
            [1, 3],
            [-2, 3],
          ],
        ],
        expected: [3, 3, 4],
      },
      {
        args: [
          [-2],
          [
            [-3, 4],
            [-2, 4],
            [0, 4],
          ],
        ],
        expected: [1, 1, 0],
      },
      {
        args: [
          [-3, -2],
          [
            [-3, 1],
            [-3, 4],
            [-3, 2],
          ],
        ],
        expected: [2, 2, 2],
      },
      {
        args: [
          [1],
          [
            [-1, 0],
            [-1, 3],
            [-2, -1],
          ],
        ],
        expected: [0, 1, 0],
      },
      {
        args: [
          [-1, 2],
          [
            [-3, -1],
            [-3, -3],
            [-3, 2],
          ],
        ],
        expected: [1, 0, 2],
      },
      {
        args: [
          [-3, -3, -1, 2, 2],
          [
            [-1, 3],
            [-2, -1],
            [-1, 2],
          ],
        ],
        expected: [3, 1, 3],
      },
      {
        args: [
          [-1, 2],
          [
            [1, 2],
            [1, 1],
            [0, 1],
          ],
        ],
        expected: [1, 0, 0],
      },
    ],
    47: [
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: -4,
              left: null,
              right: {
                value: 4,
                left: {
                  value: -1,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: -1,
              left: {
                value: -6,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 5,
              left: {
                value: 2,
                left: null,
                right: null,
              },
              right: {
                value: 8,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -5,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: 0,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: {
                value: 8,
                left: {
                  value: 1,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 7,
            left: null,
            right: null,
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -8,
              left: null,
              right: {
                value: -2,
                left: null,
                right: null,
              },
            },
            right: {
              value: 8,
              left: {
                value: 4,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: 3,
              left: {
                value: -1,
                left: {
                  value: -8,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 2,
              left: null,
              right: {
                value: 3,
                left: null,
                right: null,
              },
            },
            right: null,
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -7,
              left: null,
              right: {
                value: 0,
                left: {
                  value: -5,
                  left: null,
                  right: null,
                },
                right: {
                  value: 1,
                  left: null,
                  right: null,
                },
              },
            },
            right: {
              value: 6,
              left: null,
              right: null,
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -2,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: {
              value: 8,
              left: {
                value: 0,
                left: null,
                right: null,
              },
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -1,
              left: null,
              right: null,
            },
            right: {
              value: 4,
              left: null,
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -1,
            left: null,
            right: {
              value: 3,
              left: null,
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -4,
            left: {
              value: -7,
              left: null,
              right: {
                value: -5,
                left: null,
                right: null,
              },
            },
            right: {
              value: -3,
              left: null,
              right: {
                value: 3,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: true,
      },
    ],
    50: [
      {
        args: [[1, 1, 1], 2],
        expected: 3,
      },
      {
        args: [[4, 1, 7, 6], 6],
        expected: 1,
      },
      {
        args: [[6, 7, 5, 6], 1],
        expected: 0,
      },
      {
        args: [[6, 4, 1, 6, 3, 7], 6],
        expected: 2,
      },
      {
        args: [[6, 7, 1, 7, 4, 4], 2],
        expected: 0,
      },
      {
        args: [[6, 7, 4, 1, 4], 7],
        expected: 2,
      },
      {
        args: [[6, 4, 6, 1, 6, 4], 8],
        expected: 1,
      },
      {
        args: [[7, 5, 5], 4],
        expected: 0,
      },
      {
        args: [[4, 5, 5, 1, 5, 2], 4],
        expected: 1,
      },
      {
        args: [[1, 5, 6, 3], 7],
        expected: 1,
      },
      {
        args: [[7, 3, 1], 7],
        expected: 1,
      },
      {
        args: [[1, 6, 6, 6, 4, 7], 1],
        expected: 1,
      },
    ],
    51: [
      {
        args: [[2, 2, 3]],
        expected: [2, 1, 0],
      },
      {
        args: [[2, 0, -3, 3, 0, -3]],
        expected: [3, 2, 1, 0, 0, 0],
      },
      {
        args: [[1]],
        expected: [0],
      },
      {
        args: [[3, -2, -1, 0, -2]],
        expected: [0, 1, 1, 0, 0],
      },
      {
        args: [[3, -3, 3, -1]],
        expected: [0, 1, 0, 0],
      },
      {
        args: [[-3, 2, 3, 1, -1, -3]],
        expected: [1, 1, 0, 0, 0, 0],
      },
      {
        args: [[-1, 2, 3, -2]],
        expected: [1, 1, 0, 0],
      },
      {
        args: [[-3, 1, -3]],
        expected: [1, 0, 0],
      },
      {
        args: [[2]],
        expected: [0],
      },
      {
        args: [[1, 3, -2, 1, -1]],
        expected: [1, 0, 1, 0, 0],
      },
      {
        args: [[2, 1]],
        expected: [0, 0],
      },
      {
        args: [[3, 2, 3]],
        expected: [0, 1, 0],
      },
    ],
    59: [
      {
        args: [[4, 2, 3, 2]],
        expected: 3,
      },
      {
        args: [[3, 3, 3, 4, 4, 3]],
        expected: 8,
      },
      {
        args: [[4]],
        expected: 0,
      },
      {
        args: [[3, 4, 3]],
        expected: 2,
      },
      {
        args: [[3, 3, 2]],
        expected: 2,
      },
      {
        args: [[4, 2, 3, 3, 1]],
        expected: 8,
      },
      {
        args: [[1, 2, 4]],
        expected: 2,
      },
      {
        args: [[3]],
        expected: 0,
      },
      {
        args: [[4, 2, 3, 4]],
        expected: 3,
      },
      {
        args: [[1, 1]],
        expected: 1,
      },
      {
        args: [[4, 3]],
        expected: 1,
      },
      {
        args: [[2]],
        expected: 0,
      },
    ],
    66: [
      {
        args: [[2, 4, -3]],
        expected: [2, 4, -3],
      },
      {
        args: [[3, 5, -4, 3, 4, -4, -5]],
        expected: [3, 5, -4, 4, -5],
      },
      {
        args: [[0, 3, -3, 3, -1]],
        expected: [0, 3, -3, -1],
      },
      {
        args: [[-5, 5]],
        expected: [-5, 5],
      },
      {
        args: [[1, -3, 1, -5, -5, 2, 5]],
        expected: [1, -3, -5, 2, 5],
      },
      {
        args: [[-1, 2, -3, -2, -5, 5]],
        expected: [-1, 2, -3, -2, -5, 5],
      },
      {
        args: [[2, 2, 0, 1, 1, -3, 3]],
        expected: [2, 0, 1, -3, 3],
      },
      {
        args: [[-4, 3, -4, -4]],
        expected: [-4, 3],
      },
      {
        args: [[2, 3, -3, 0, 4]],
        expected: [2, 3, -3, 0, 4],
      },
      {
        args: [[4, -1, -5, -3, -4, -4]],
        expected: [4, -1, -5, -3, -4],
      },
      {
        args: [[-2]],
        expected: [-2],
      },
      {
        args: [[0, 5, 3]],
        expected: [0, 5, 3],
      },
    ],
    67: [
      {
        args: [[5, 1, 4, 1, 1]],
        expected: 12,
      },
      {
        args: [[4, 2, 3]],
        expected: 9,
      },
      {
        args: [[0]],
        expected: 0,
      },
      {
        args: [[4, 1, 1, 5, 0, 2, 2]],
        expected: 15,
      },
      {
        args: [[5, 0, 5, 5, 4, 3, 1]],
        expected: 23,
      },
      {
        args: [[1, 5, 2, 3]],
        expected: 11,
      },
      {
        args: [[2, 1]],
        expected: 3,
      },
      {
        args: [[5, 4, 5, 0, 4, 1, 5]],
        expected: 24,
      },
      {
        args: [[3, 1, 1, 2, 5, 4]],
        expected: 16,
      },
      {
        args: [[3, 3, 1]],
        expected: 7,
      },
      {
        args: [[0, 5, 2, 0, 3]],
        expected: 10,
      },
      {
        args: [[5, 5, 5, 4, 2, 2, 3]],
        expected: 26,
      },
    ],
    68: [
      {
        args: [6],
        expected: 15,
      },
      {
        args: [29],
        expected: 406,
      },
      {
        args: [11],
        expected: 55,
      },
      {
        args: [19],
        expected: 171,
      },
      {
        args: [28],
        expected: 378,
      },
      {
        args: [16],
        expected: 120,
      },
      {
        args: [15],
        expected: 105,
      },
      {
        args: [12],
        expected: 66,
      },
      {
        args: [22],
        expected: 231,
      },
      {
        args: [18],
        expected: 153,
      },
      {
        args: [2],
        expected: 1,
      },
      {
        args: [14],
        expected: 91,
      },
    ],
    69: [
      {
        args: [[-4, -3, -4, -5, -2]],
        expected: [[-5, -2], 8],
      },
      {
        args: [[-1, -5, 3, -5, 3]],
        expected: [[-5, -5, 3], 7],
      },
      {
        args: [[4]],
        expected: [[4], 1],
      },
      {
        args: [[-1, -4, 2]],
        expected: [[-4, 2], 4],
      },
      {
        args: [[-2, 1, 2]],
        expected: [[-2, 1, 2], 3],
      },
      {
        args: [[-5, 5, -3, -3, -1, 5]],
        expected: [[-5, -3, -3, -1, 5], 7],
      },
      {
        args: [[0]],
        expected: [[0], 1],
      },
      {
        args: [[-2, 4, 1, -1, 4, 3]],
        expected: [[-2, -1, 3], 9],
      },
      {
        args: [[-2, -1, 4, -2, -5, -3, -3]],
        expected: [[-5, -3, -3], 11],
      },
      {
        args: [[-5]],
        expected: [[-5], 1],
      },
      {
        args: [[-1, 1]],
        expected: [[-1, 1], 2],
      },
      {
        args: [[-3, 5, -1]],
        expected: [[-3, -1], 4],
      },
    ],
    70: [
      {
        args: [13],
        expected: 12,
      },
      {
        args: [18],
        expected: 17,
      },
      {
        args: [14],
        expected: 13,
      },
      {
        args: [10],
        expected: 9,
      },
      {
        args: [12],
        expected: 11,
      },
      {
        args: [17],
        expected: 16,
      },
      {
        args: [21],
        expected: 20,
      },
      {
        args: [8],
        expected: 7,
      },
      {
        args: [2],
        expected: 1,
      },
      {
        args: [6],
        expected: 5,
      },
      {
        args: [15],
        expected: 14,
      },
      {
        args: [11],
        expected: 10,
      },
    ],
    71: [
      {
        args: [[13, 4, 24, 15, 7, 12]],
        expected: [
          [4, 1],
          [7, 1],
          [12, 1],
          [13, 1],
          [15, 1],
          [24, 1],
        ],
      },
      {
        args: [[4, 25, 4, 2, 31]],
        expected: [
          [2, 1],
          [4, 2],
          [25, 1],
          [31, 1],
        ],
      },
      {
        args: [[29, 26, 4, 21, 0, 8]],
        expected: [
          [0, 1],
          [4, 1],
          [8, 1],
          [21, 1],
          [26, 1],
          [29, 1],
        ],
      },
      {
        args: [[4, 7, 15, 8]],
        expected: [
          [4, 1],
          [7, 1],
          [8, 1],
          [15, 1],
        ],
      },
      {
        args: [[38, 4, 33, 25]],
        expected: [
          [4, 1],
          [25, 1],
          [33, 1],
          [38, 1],
        ],
      },
      {
        args: [[16, 35, 10, 43, 24]],
        expected: [
          [10, 1],
          [16, 1],
          [24, 1],
          [35, 1],
          [43, 1],
        ],
      },
      {
        args: [[40, 37, 18]],
        expected: [
          [18, 1],
          [37, 1],
          [40, 1],
        ],
      },
      {
        args: [[40, 10, 6, 17]],
        expected: [
          [6, 1],
          [10, 1],
          [17, 1],
          [40, 1],
        ],
      },
      {
        args: [[26, 13, 12, 26, 18, 6, 22]],
        expected: [
          [6, 1],
          [12, 1],
          [13, 1],
          [18, 1],
          [22, 1],
          [26, 2],
        ],
      },
      {
        args: [[26, 20, 29, 16, 20, 1, 8]],
        expected: [
          [1, 1],
          [8, 1],
          [16, 1],
          [20, 2],
          [26, 1],
          [29, 1],
        ],
      },
      {
        args: [[6, 14, 32]],
        expected: [
          [6, 1],
          [14, 1],
          [32, 1],
        ],
      },
      {
        args: [[32]],
        expected: [[32, 1]],
      },
    ],
    72: [
      {
        args: [["", "", "", "", "", ""]],
        expected: ["", "", "", "", "", ""],
      },
      {
        args: [[""]],
        expected: [""],
      },
      {
        args: [["bb", "cb", "bc", "cb", "aa", "aa"]],
        expected: ["aa", "aa", "bb", "bc", "cb", "cb"],
      },
      {
        args: [["cac"]],
        expected: ["cac"],
      },
      {
        args: [["bcb", "cab", "cac"]],
        expected: ["bcb", "cab", "cac"],
      },
      {
        args: [["c", "b", "b"]],
        expected: ["b", "b", "c"],
      },
      {
        args: [["c", "a", "a"]],
        expected: ["a", "a", "c"],
      },
      {
        args: [["", "", "", "", ""]],
        expected: ["", "", "", "", ""],
      },
      {
        args: [["", "", "", "", "", "", ""]],
        expected: ["", "", "", "", "", "", ""],
      },
      {
        args: [["aa", "ca"]],
        expected: ["aa", "ca"],
      },
      {
        args: [["ccc", "cab"]],
        expected: ["cab", "ccc"],
      },
      {
        args: [["bb", "ab", "bb", "aa"]],
        expected: ["aa", "ab", "bb", "bb"],
      },
    ],
    73: [
      {
        args: [[-2]],
        expected: -2,
      },
      {
        args: [[-4, -5, 1, -1, -4]],
        expected: -4,
      },
      {
        args: [[2, 4, 4]],
        expected: 4,
      },
      {
        args: [[1]],
        expected: 1,
      },
      {
        args: [[0, 3]],
        expected: 0,
      },
      {
        args: [[-1, -3, 0, -1]],
        expected: -1,
      },
      {
        args: [[-2, -3, 3, 2, -1]],
        expected: -1,
      },
      {
        args: [[5, -4, 0, -2]],
        expected: -2,
      },
      {
        args: [[-1, 5, -5, -2]],
        expected: -2,
      },
      {
        args: [[1, -5, -1, 5, 1, -4, 1]],
        expected: 1,
      },
      {
        args: [[-4, 1, 3, 4, 0, 3, 4]],
        expected: 3,
      },
      {
        args: [[3, -3, 4, -2]],
        expected: -2,
      },
    ],
    74: [
      {
        args: [
          [
            [3, 1, "id0"],
            [2, 1, "id1"],
            [3, 3, "id2"],
            [3, 2, "id3"],
            [1, 3, "id4"],
            [3, 2, "id5"],
            [2, 1, "id6"],
          ],
        ],
        expected: [
          [1, 3, "id4"],
          [2, 1, "id1"],
          [2, 1, "id6"],
          [3, 1, "id0"],
          [3, 2, "id3"],
          [3, 2, "id5"],
          [3, 3, "id2"],
        ],
      },
      {
        args: [
          [
            [3, 0, "id0"],
            [3, 2, "id1"],
            [1, 0, "id2"],
            [0, 1, "id3"],
            [2, 0, "id4"],
            [1, 2, "id5"],
            [2, 1, "id6"],
          ],
        ],
        expected: [
          [0, 1, "id3"],
          [1, 0, "id2"],
          [1, 2, "id5"],
          [2, 0, "id4"],
          [2, 1, "id6"],
          [3, 0, "id0"],
          [3, 2, "id1"],
        ],
      },
      {
        args: [
          [
            [3, 3, "id0"],
            [1, 2, "id1"],
            [2, 0, "id2"],
            [2, 2, "id3"],
            [3, 1, "id4"],
          ],
        ],
        expected: [
          [1, 2, "id1"],
          [2, 0, "id2"],
          [2, 2, "id3"],
          [3, 1, "id4"],
          [3, 3, "id0"],
        ],
      },
      {
        args: [
          [
            [3, 1, "id0"],
            [0, 2, "id1"],
            [3, 2, "id2"],
            [3, 2, "id3"],
          ],
        ],
        expected: [
          [0, 2, "id1"],
          [3, 1, "id0"],
          [3, 2, "id2"],
          [3, 2, "id3"],
        ],
      },
      {
        args: [
          [
            [1, 3, "id0"],
            [0, 3, "id1"],
            [3, 2, "id2"],
            [0, 1, "id3"],
            [0, 1, "id4"],
            [1, 0, "id5"],
            [1, 3, "id6"],
          ],
        ],
        expected: [
          [0, 1, "id3"],
          [0, 1, "id4"],
          [0, 3, "id1"],
          [1, 0, "id5"],
          [1, 3, "id0"],
          [1, 3, "id6"],
          [3, 2, "id2"],
        ],
      },
      {
        args: [
          [
            [2, 1, "id0"],
            [0, 1, "id1"],
            [1, 2, "id2"],
            [1, 1, "id3"],
            [0, 3, "id4"],
            [0, 3, "id5"],
          ],
        ],
        expected: [
          [0, 1, "id1"],
          [0, 3, "id4"],
          [0, 3, "id5"],
          [1, 1, "id3"],
          [1, 2, "id2"],
          [2, 1, "id0"],
        ],
      },
      {
        args: [[[3, 0, "id0"]]],
        expected: [[3, 0, "id0"]],
      },
      {
        args: [
          [
            [2, 2, "id0"],
            [2, 3, "id1"],
            [0, 3, "id2"],
          ],
        ],
        expected: [
          [0, 3, "id2"],
          [2, 2, "id0"],
          [2, 3, "id1"],
        ],
      },
      {
        args: [
          [
            [3, 2, "id0"],
            [3, 0, "id1"],
          ],
        ],
        expected: [
          [3, 0, "id1"],
          [3, 2, "id0"],
        ],
      },
      {
        args: [
          [
            [2, 1, "id0"],
            [1, 2, "id1"],
            [2, 2, "id2"],
          ],
        ],
        expected: [
          [1, 2, "id1"],
          [2, 1, "id0"],
          [2, 2, "id2"],
        ],
      },
      {
        args: [
          [
            [3, 3, "id0"],
            [1, 1, "id1"],
          ],
        ],
        expected: [
          [1, 1, "id1"],
          [3, 3, "id0"],
        ],
      },
      {
        args: [
          [
            [1, 0, "id0"],
            [0, 3, "id1"],
            [0, 0, "id2"],
            [1, 0, "id3"],
            [3, 1, "id4"],
            [3, 0, "id5"],
            [1, 3, "id6"],
          ],
        ],
        expected: [
          [0, 0, "id2"],
          [0, 3, "id1"],
          [1, 0, "id0"],
          [1, 0, "id3"],
          [1, 3, "id6"],
          [3, 0, "id5"],
          [3, 1, "id4"],
        ],
      },
    ],
    75: [
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: -2,
              left: {
                value: -3,
                left: null,
                right: null,
              },
              right: {
                value: 7,
                left: {
                  value: -1,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
          -7,
          1,
        ],
        expected: [-8, 7],
      },
      {
        args: [
          {
            value: -4,
            left: {
              value: -6,
              left: null,
              right: {
                value: -5,
                left: null,
                right: null,
              },
            },
            right: {
              value: 5,
              left: {
                value: 0,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          -8,
          6,
        ],
        expected: [],
      },
      {
        args: [null, -4, 5],
        expected: [],
      },
      {
        args: [
          {
            value: -3,
            left: null,
            right: {
              value: 7,
              left: {
                value: 0,
                left: null,
                right: null,
              },
              right: {
                value: 8,
                left: null,
                right: null,
              },
            },
          },
          -9,
          -7,
        ],
        expected: [-3, 0, 7, 8],
      },
      {
        args: [
          {
            value: 3,
            left: null,
            right: null,
          },
          -9,
          -2,
        ],
        expected: [3],
      },
      {
        args: [
          {
            value: -5,
            left: null,
            right: null,
          },
          -1,
          4,
        ],
        expected: [-5],
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 0,
              left: {
                value: -8,
                left: null,
                right: {
                  value: -5,
                  left: null,
                  right: null,
                },
              },
              right: {
                value: 3,
                left: {
                  value: 1,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: null,
          },
          -8,
          -6,
        ],
        expected: [-5, 0, 1, 3, 5],
      },
      {
        args: [null, -7, 1],
        expected: [],
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: 6,
              left: {
                value: 1,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          -3,
          -2,
        ],
        expected: [-8, 1, 6],
      },
      {
        args: [
          {
            value: 1,
            left: null,
            right: null,
          },
          -7,
          -6,
        ],
        expected: [1],
      },
      {
        args: [
          {
            value: 4,
            left: null,
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
          -9,
          -3,
        ],
        expected: [4, 7],
      },
      {
        args: [
          {
            value: 6,
            left: {
              value: 1,
              left: {
                value: -3,
                left: null,
                right: {
                  value: -2,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
          -4,
          6,
        ],
        expected: [8],
      },
    ],
    76: [
      {
        args: [
          {
            value: 3,
            left: {
              value: -2,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: {
                value: 0,
                left: null,
                right: {
                  value: 2,
                  left: null,
                  right: null,
                },
              },
            },
            right: null,
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: 4,
              left: null,
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -4,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: {
              value: 3,
              left: {
                value: -2,
                left: {
                  value: -3,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: 6,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: 0,
              left: {
                value: -5,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 2,
              left: null,
              right: {
                value: 8,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -7,
            left: null,
            right: null,
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -7,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -6,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: 3,
              left: null,
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -5,
            left: {
              value: -1,
              left: {
                value: -4,
                left: {
                  value: -6,
                  left: null,
                  right: null,
                },
                right: {
                  value: -3,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: null,
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: -6,
              left: {
                value: -7,
                left: null,
                right: null,
              },
              right: {
                value: -2,
                left: null,
                right: null,
              },
            },
            right: {
              value: 8,
              left: null,
              right: null,
            },
          },
        ],
        expected: true,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: -5,
              left: null,
              right: {
                value: 7,
                left: {
                  value: 3,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: 7,
            left: {
              value: -8,
              left: null,
              right: null,
            },
            right: {
              value: -3,
              left: {
                value: -5,
                left: null,
                right: null,
              },
              right: {
                value: -2,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: false,
      },
      {
        args: [
          {
            value: -3,
            left: {
              value: -7,
              left: null,
              right: null,
            },
            right: {
              value: 4,
              left: null,
              right: null,
            },
          },
        ],
        expected: true,
      },
    ],
    77: [
      {
        args: [
          {
            value: 7,
            left: {
              value: 1,
              left: null,
              right: null,
            },
            right: null,
          },
          [2, -1],
        ],
        expected: [null, null],
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -5,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: null,
            },
            right: {
              value: 6,
              left: {
                value: 3,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          [5, 2, 3],
        ],
        expected: [null, 0, 3],
      },
      {
        args: [
          {
            value: -2,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: {
              value: 1,
              left: null,
              right: null,
            },
          },
          [5],
        ],
        expected: [null],
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -3,
              left: null,
              right: {
                value: -2,
                left: null,
                right: null,
              },
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
          [2, -2, -3],
        ],
        expected: [2, null, null],
      },
      {
        args: [
          {
            value: 4,
            left: null,
            right: null,
          },
          [4],
        ],
        expected: [null],
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -5,
              left: null,
              right: null,
            },
            right: null,
          },
          [-5, 0, 4, 5, 5, 0, 2],
        ],
        expected: [null, -5, null, null, null, -5, null],
      },
      {
        args: [
          {
            value: -8,
            left: null,
            right: null,
          },
          [],
        ],
        expected: [],
      },
      {
        args: [null, [0, 0, -3, 1, 2, -5, -2]],
        expected: [null, null, null, null, null, null, null],
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -7,
              left: null,
              right: {
                value: -1,
                left: null,
                right: null,
              },
            },
            right: {
              value: 5,
              left: null,
              right: null,
            },
          },
          [4, -1, 4, -4],
        ],
        expected: [null, null, null, null],
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: -3,
              left: {
                value: -6,
                left: {
                  value: -8,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: {
                value: -2,
                left: null,
                right: null,
              },
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
          [-1, 4],
        ],
        expected: [null, 5],
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: -7,
              left: null,
              right: null,
            },
            right: {
              value: 3,
              left: null,
              right: null,
            },
          },
          [-1, -5, -3, -4],
        ],
        expected: [null, null, null, null],
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -2,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: {
                value: 6,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          [-2, -1, 3, 3, 5],
        ],
        expected: [null, null, 8, 8, null],
      },
    ],
    78: [
      {
        args: [
          {
            value: -8,
            left: null,
            right: {
              value: 5,
              left: {
                value: -3,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          [-2, 4, -1],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: -1,
              left: {
                value: -5,
                left: null,
                right: {
                  value: -2,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: {
              value: 5,
              left: null,
              right: null,
            },
          },
          [-3],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -4,
              left: {
                value: -6,
                left: null,
                right: null,
              },
              right: {
                value: 6,
                left: {
                  value: 5,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: null,
          },
          [3, -3, 3],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -7,
            left: null,
            right: {
              value: 3,
              left: {
                value: -2,
                left: {
                  value: -5,
                  left: null,
                  right: null,
                },
                right: {
                  value: 2,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
          },
          [5, -1, 5],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 7,
            left: {
              value: -2,
              left: null,
              right: {
                value: -1,
                left: null,
                right: null,
              },
            },
            right: null,
          },
          [2, -2, 3],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 0,
            left: {
              value: -2,
              left: null,
              right: null,
            },
            right: {
              value: 6,
              left: {
                value: 3,
                left: null,
                right: {
                  value: 5,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
          },
          [-4, 4, -2],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: null,
          },
          [5, -1, 5],
        ],
        expected: null,
      },
      {
        args: [null, [4]],
        expected: null,
      },
      {
        args: [
          {
            value: 8,
            left: {
              value: -2,
              left: null,
              right: null,
            },
            right: null,
          },
          [3, -4, 4],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: 0,
              left: {
                value: -4,
                left: null,
                right: {
                  value: -3,
                  left: null,
                  right: null,
                },
              },
              right: null,
            },
            right: {
              value: 6,
              left: {
                value: 5,
                left: null,
                right: null,
              },
              right: null,
            },
          },
          [],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -4,
              left: {
                value: -8,
                left: null,
                right: null,
              },
              right: {
                value: -1,
                left: null,
                right: null,
              },
            },
            right: {
              value: 4,
              left: null,
              right: null,
            },
          },
          [-5],
        ],
        expected: null,
      },
      {
        args: [
          {
            value: 1,
            left: {
              value: 0,
              left: null,
              right: null,
            },
            right: {
              value: 7,
              left: null,
              right: {
                value: 8,
                left: null,
                right: null,
              },
            },
          },
          [1, 0, -2],
        ],
        expected: null,
      },
    ],
    79: [
      {
        args: [
          [2, 2],
          [
            ["set", 1, 4],
            ["set", 1, 3],
            ["set", 0, 5],
          ],
        ],
        expected: [],
      },
      {
        args: [
          [5],
          [
            ["set", 0, 7],
            ["set", 0, 7],
            ["set", 0, 3],
          ],
        ],
        expected: [],
      },
      {
        args: [[5, 5, 4, 1, 2, 5], []],
        expected: [],
      },
      {
        args: [
          [3, 4, 1, 4],
          [
            ["set", 3, 6],
            ["first", 7],
          ],
        ],
        expected: [1],
      },
      {
        args: [
          [4, 2, 2, 5, 4],
          [
            ["first", 12],
            ["first", 5],
            ["set", 3, 7],
            ["set", 4, 6],
          ],
        ],
        expected: [3, 1],
      },
      {
        args: [[2, 4, 4, 4], []],
        expected: [],
      },
      {
        args: [
          [2],
          [
            ["first", 4],
            ["set", 0, 7],
            ["first", 3],
            ["first", 12],
          ],
        ],
        expected: [-1, 0, -1],
      },
      {
        args: [
          [5, 5, 0, 4, 3],
          [
            ["first", 15],
            ["first", 5],
            ["first", 3],
            ["first", 9],
          ],
        ],
        expected: [4, 0, 0, 1],
      },
      {
        args: [
          [1, 3],
          [
            ["set", 1, 1],
            ["first", 7],
            ["first", 11],
          ],
        ],
        expected: [-1, -1],
      },
      {
        args: [[2, 1, 3], [["set", 2, 0]]],
        expected: [],
      },
      {
        args: [[2, 0, 0, 0], [["first", 8]]],
        expected: [-1],
      },
      {
        args: [
          [2, 1, 1, 1, 2, 2, 1],
          [
            ["set", 5, 2],
            ["set", 1, 5],
            ["set", 1, 1],
            ["first", 8],
            ["first", 2],
          ],
        ],
        expected: [5, 0],
      },
    ],
    80: [
      {
        args: [
          2,
          [
            [0, 0],
            [1, 0],
          ],
          1,
        ],
        expected: true,
      },
      {
        args: [3, [[0, 0]], 0],
        expected: true,
      },
      {
        args: [
          5,
          [
            [1, 2],
            [4, 0],
          ],
          0,
        ],
        expected: false,
      },
      {
        args: [5, [[4, 2]], 0],
        expected: false,
      },
      {
        args: [
          5,
          [
            [4, 1],
            [4, 0],
          ],
          2,
        ],
        expected: false,
      },
      {
        args: [
          5,
          [
            [1, 0],
            [1, 1],
            [4, 2],
          ],
          1,
        ],
        expected: true,
      },
      {
        args: [
          2,
          [
            [1, 1],
            [0, 1],
          ],
          1,
        ],
        expected: true,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          0,
        ],
        expected: true,
      },
      {
        args: [
          2,
          [
            [0, 0],
            [1, 1],
            [1, 1],
            [1, 0],
            [1, 0],
          ],
          0,
        ],
        expected: true,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [0, 0],
            [0, 1],
            [0, 0],
            [1, 1],
          ],
          1,
        ],
        expected: true,
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 0],
          ],
          0,
        ],
        expected: true,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [0, 0],
            [1, 0],
          ],
          0,
        ],
        expected: true,
      },
    ],
    81: [
      {
        args: [
          2,
          [
            [1, 1],
            [0, 0],
            [0, 1],
            [1, 1],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [1, 2],
            [3, 2],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [0, 0],
            [1, 2],
          ],
        ],
        expected: 3,
      },
      {
        args: [2, []],
        expected: 2,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [1, 1],
            [2, 1],
            [1, 0],
            [2, 1],
            [2, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [1, []],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [2, 0],
            [2, 1],
            [0, 2],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [0, 1],
            [0, 2],
            [2, 1],
            [2, 0],
            [2, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          4,
          [
            [1, 3],
            [1, 3],
            [1, 2],
            [2, 1],
            [3, 1],
            [3, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
    ],
    82: [
      {
        args: [0, [], []],
        expected: [],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          [2, 2],
        ],
        expected: [1, 1],
      },
      {
        args: [
          4,
          [
            [1, 3],
            [0, 0],
            [2, 1],
          ],
          [0, 2, 1],
        ],
        expected: [3, 3, 2],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          [],
        ],
        expected: [],
      },
      {
        args: [
          4,
          [
            [3, 3],
            [0, 1],
            [0, 0],
          ],
          [2, 0, 0],
        ],
        expected: [3, 3, 3],
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 0],
            [1, 1],
            [0, 0],
            [1, 1],
          ],
          [2],
        ],
        expected: [2],
      },
      {
        args: [
          2,
          [
            [0, 0],
            [1, 1],
            [1, 1],
            [1, 0],
            [0, 1],
            [1, 1],
          ],
          [4, 3],
        ],
        expected: [1, 1],
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 0],
          ],
          [],
        ],
        expected: [],
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          [0, 1, 1],
        ],
        expected: [1, 1, 1],
      },
      {
        args: [1, [], []],
        expected: [],
      },
      {
        args: [
          5,
          [
            [4, 4],
            [0, 0],
            [1, 3],
            [2, 2],
            [3, 3],
          ],
          [4],
        ],
        expected: [4],
      },
      {
        args: [
          3,
          [
            [1, 1],
            [2, 2],
          ],
          [0, 0],
        ],
        expected: [3, 3],
      },
    ],
    83: [
      {
        args: [
          4,
          [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          5,
          [
            [4, 1],
            [2, 1],
            [3, 1],
            [1, 4],
            [2, 0],
            [1, 3],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [2, 0],
            [2, 1],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          5,
          [
            [4, 0],
            [2, 3],
            [3, 0],
            [1, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [2, 1],
            [0, 0],
            [3, 3],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [0, 0],
            [0, 0],
            [1, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [3, 1],
            [2, 1],
            [3, 1],
            [0, 2],
            [3, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [0, 2],
            [2, 0],
            [1, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [2, 2],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [2, 0],
            [2, 0],
          ],
        ],
        expected: 1,
      },
    ],
    84: [
      {
        args: [[7, 2, 1], []],
        expected: 7,
      },
      {
        args: [
          [3, 0, 7, 7, 0],
          [
            [1, 2],
            [0, 1],
          ],
        ],
        expected: 10,
      },
      {
        args: [
          [7, 1, 6, 5],
          [
            [2, 1],
            [2, 2],
            [2, 3],
          ],
        ],
        expected: -1,
      },
      {
        args: [[3, 6], [[0, 1]]],
        expected: 9,
      },
      {
        args: [
          [6, 3, 2, 0],
          [
            [2, 3],
            [0, 2],
          ],
        ],
        expected: 8,
      },
      {
        args: [[2, 4, 1, 4, 0], [[0, 1]]],
        expected: 6,
      },
      {
        args: [
          [7, 4],
          [
            [0, 1],
            [0, 1],
          ],
        ],
        expected: 11,
      },
      {
        args: [[2, 4, 7, 0, 0], []],
        expected: 7,
      },
      {
        args: [
          [1, 4, 1, 4, 1],
          [
            [3, 4],
            [0, 4],
          ],
        ],
        expected: 5,
      },
      {
        args: [[2, 6, 1], []],
        expected: 6,
      },
      {
        args: [
          [4, 1, 6],
          [
            [1, 1],
            [1, 0],
            [0, 0],
            [2, 0],
            [2, 2],
            [0, 2],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          [3, 6, 4, 5, 3],
          [
            [1, 2],
            [0, 1],
          ],
        ],
        expected: 13,
      },
    ],
    85: [
      {
        args: [
          5,
          [
            [3, 1, 1],
            [4, 0, 0],
            [4, 4, 3],
          ],
          [
            [1, 0, 7],
            [3, 4, 3],
            [4, 0, 8],
            [3, 2, 1],
          ],
        ],
        expected: [false, false, true, false],
      },
      {
        args: [
          4,
          [[1, 3, 1]],
          [
            [2, 2, 9],
            [3, 0, 3],
            [0, 1, 7],
            [1, 2, 0],
          ],
        ],
        expected: [true, false, false, false],
      },
      {
        args: [
          5,
          [
            [4, 3, 0],
            [4, 0, 5],
            [3, 2, 2],
            [1, 1, 1],
          ],
          [
            [2, 1, 3],
            [0, 1, 7],
            [0, 3, 2],
            [2, 0, 1],
          ],
        ],
        expected: [false, false, false, false],
      },
      {
        args: [
          4,
          [
            [2, 1, 1],
            [1, 0, 3],
            [0, 2, 1],
            [2, 2, 0],
          ],
          [],
        ],
        expected: [],
      },
      {
        args: [2, [], [[1, 0, 9]]],
        expected: [false],
      },
      {
        args: [
          2,
          [
            [0, 0, 1],
            [0, 0, 0],
            [1, 1, 0],
          ],
          [],
        ],
        expected: [],
      },
      {
        args: [4, [[2, 0, 3]], [[3, 2, 9]]],
        expected: [false],
      },
      {
        args: [
          3,
          [
            [0, 2, 5],
            [2, 0, 3],
            [2, 0, 0],
            [0, 0, 3],
          ],
          [
            [1, 0, 9],
            [0, 0, 4],
          ],
        ],
        expected: [false, true],
      },
      {
        args: [
          2,
          [
            [1, 0, 0],
            [0, 1, 5],
            [1, 1, 1],
          ],
          [
            [0, 0, 7],
            [0, 1, 2],
            [0, 1, 1],
          ],
        ],
        expected: [true, false, false],
      },
      {
        args: [
          5,
          [],
          [
            [3, 0, 9],
            [3, 2, 7],
          ],
        ],
        expected: [false, false],
      },
      {
        args: [
          3,
          [
            [1, 1, 0],
            [1, 2, 1],
            [2, 0, 4],
            [0, 0, 0],
          ],
          [
            [2, 0, 3],
            [1, 2, 7],
            [2, 0, 8],
          ],
        ],
        expected: [false, true, true],
      },
      {
        args: [
          4,
          [
            [0, 2, 2],
            [2, 2, 2],
            [1, 2, 3],
            [0, 2, 3],
            [2, 1, 2],
            [1, 0, 2],
          ],
          [[3, 2, 0]],
        ],
        expected: [false],
      },
    ],
    86: [
      {
        args: [5, [], []],
        expected: -1,
      },
      {
        args: [
          1,
          [
            [0, 0, 2],
            [0, 0, 4],
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 6],
          ],
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          3,
          [
            [2, 0, 5],
            [0, 2, 0],
          ],
          [
            [2, 0],
            [0, 2],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [0, 3, 4],
            [1, 2, 4],
            [1, 2, 2],
          ],
          [
            [0, 3],
            [1, 2],
          ],
        ],
        expected: -1,
      },
      {
        args: [
          5,
          [
            [2, 2, 4],
            [0, 1, 0],
            [3, 2, 2],
            [3, 2, 6],
          ],
          [
            [2, 2],
            [0, 1],
          ],
        ],
        expected: -1,
      },
      {
        args: [3, [], []],
        expected: -1,
      },
      {
        args: [3, [[2, 1, 3]], [[2, 1]]],
        expected: -1,
      },
      {
        args: [
          1,
          [
            [0, 0, 1],
            [0, 0, 5],
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 0],
            [0, 0, 1],
          ],
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          4,
          [
            [0, 3, 2],
            [3, 1, 5],
            [1, 2, 0],
            [1, 1, 2],
          ],
          [
            [0, 3],
            [3, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          2,
          [
            [0, 1, 6],
            [1, 0, 0],
            [0, 1, 5],
            [0, 0, 2],
            [0, 0, 0],
            [1, 0, 5],
          ],
          [
            [0, 1],
            [1, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [5, [[2, 0, 5]], [[2, 0]]],
        expected: -1,
      },
      {
        args: [
          4,
          [
            [1, 1, 3],
            [1, 3, 3],
            [1, 0, 5],
            [0, 0, 4],
            [1, 3, 1],
            [2, 0, 6],
          ],
          [
            [1, 1],
            [1, 3],
          ],
        ],
        expected: 11,
      },
    ],
    87: [
      {
        args: [[], 3, []],
        expected: 0,
      },
      {
        args: [
          [1],
          2,
          [
            [0, 1],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [0, 2],
          3,
          [
            [1, 1],
            [0, 0],
            [1, 0],
            [1, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [0],
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          [2, 0, 0],
          1,
          [
            [1, 0],
            [1, 0],
            [1, 0],
            [1, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [[0, 2, 2], 2, [[1, 0]]],
        expected: 1,
      },
      {
        args: [
          [0, 2],
          2,
          [
            [1, 1],
            [0, 0],
            [0, 0],
            [1, 0],
            [0, 0],
            [0, 1],
            [1, 0],
          ],
        ],
        expected: 2,
      },
      {
        args: [[0, 2, 2], 0, []],
        expected: 0,
      },
      {
        args: [[2], 0, []],
        expected: 0,
      },
      {
        args: [
          [1],
          3,
          [
            [0, 0],
            [0, 2],
            [0, 1],
            [0, 2],
            [0, 0],
            [0, 0],
            [0, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [0],
          2,
          [
            [0, 0],
            [0, 1],
            [0, 1],
            [0, 1],
            [0, 1],
          ],
        ],
        expected: 0,
      },
      {
        args: [[1], 2, []],
        expected: 0,
      },
    ],
    88: [
      {
        args: [
          3,
          4,
          [
            [1, 3],
            [1, 0],
            [2, 1],
            [2, 2],
            [0, 1],
            [0, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          3,
          [
            [1, 0],
            [0, 2],
            [0, 2],
            [0, 0],
            [0, 0],
            [1, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          1,
          4,
          [
            [0, 3],
            [0, 2],
            [0, 3],
            [0, 3],
            [0, 2],
            [0, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [
          3,
          4,
          [
            [1, 1],
            [0, 1],
            [1, 1],
            [1, 3],
            [0, 0],
          ],
        ],
        expected: [2],
      },
      {
        args: [0, 4, []],
        expected: [],
      },
      {
        args: [
          1,
          3,
          [
            [0, 0],
            [0, 2],
          ],
        ],
        expected: [],
      },
      {
        args: [1, 0, []],
        expected: [0],
      },
      {
        args: [
          2,
          3,
          [
            [0, 0],
            [0, 2],
            [1, 0],
            [1, 2],
            [0, 2],
            [1, 1],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [1, 0],
          ],
        ],
        expected: [0, 1],
      },
      {
        args: [
          2,
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: [1],
      },
      {
        args: [
          2,
          2,
          [
            [0, 1],
            [1, 0],
          ],
        ],
        expected: [],
      },
      {
        args: [
          2,
          3,
          [
            [1, 2],
            [0, 0],
          ],
        ],
        expected: [],
      },
    ],
    89: [
      {
        args: ["a"],
        expected: 0,
      },
      {
        args: ["b"],
        expected: 0,
      },
      {
        args: ["bAB"],
        expected: 2,
      },
      {
        args: ["ba"],
        expected: 1,
      },
      {
        args: ["aAa"],
        expected: 0,
      },
      {
        args: ["BbB"],
        expected: 0,
      },
      {
        args: ["bBABa"],
        expected: 2,
      },
      {
        args: ["ABa"],
        expected: 2,
      },
      {
        args: ["BBbBBa"],
        expected: 1,
      },
      {
        args: ["AAaaAA"],
        expected: 0,
      },
      {
        args: ["abbAb"],
        expected: 2,
      },
      {
        args: ["BA"],
        expected: 1,
      },
    ],
    90: [
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: 5,
              left: {
                value: -3,
                left: null,
                right: null,
              },
              right: {
                value: 7,
                left: null,
                right: null,
              },
            },
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: 4,
            left: null,
            right: null,
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: -4,
            left: null,
            right: null,
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: -1,
            left: {
              value: -7,
              left: null,
              right: {
                value: -2,
                left: {
                  value: -5,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
            right: {
              value: 7,
              left: null,
              right: null,
            },
          },
        ],
        expected: 2,
      },
      {
        args: [
          {
            value: -2,
            left: {
              value: -6,
              left: null,
              right: null,
            },
            right: {
              value: 2,
              left: null,
              right: null,
            },
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: 2,
            left: {
              value: -4,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: null,
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: 3,
            left: {
              value: -4,
              left: null,
              right: {
                value: 0,
                left: null,
                right: {
                  value: 2,
                  left: {
                    value: 1,
                    left: null,
                    right: null,
                  },
                  right: null,
                },
              },
            },
            right: null,
          },
        ],
        expected: 2,
      },
      {
        args: [
          {
            value: 5,
            left: {
              value: 3,
              left: null,
              right: null,
            },
            right: null,
          },
        ],
        expected: 1,
      },
      {
        args: [
          {
            value: 4,
            left: {
              value: -1,
              left: {
                value: -3,
                left: {
                  value: -6,
                  left: null,
                  right: null,
                },
                right: null,
              },
              right: null,
            },
            right: null,
          },
        ],
        expected: 2,
      },
      {
        args: [
          {
            value: -6,
            left: null,
            right: {
              value: -2,
              left: {
                value: -4,
                left: null,
                right: null,
              },
              right: {
                value: 7,
                left: {
                  value: 0,
                  left: null,
                  right: null,
                },
                right: null,
              },
            },
          },
        ],
        expected: 2,
      },
      {
        args: [
          {
            value: -3,
            left: null,
            right: null,
          },
        ],
        expected: 1,
      },
    ],
    91: [
      {
        args: [
          [
            [5, 4, 4, 4, 6],
            [2, -2, -2, 4, 5],
            [2, 0, -1, -3, 4],
            [6, -2, -3, 3, 5],
            [4, 1, 7, 4, 5],
          ],
        ],
        expected: 2,
      },
      {
        args: [[[2]]],
        expected: 2,
      },
      {
        args: [
          [
            [0, 0, -2],
            [4, 2, 6],
            [-2, -2, 5],
          ],
        ],
        expected: -2,
      },
      {
        args: [
          [
            [7, -3, -3, 4],
            [1, 6, 7, 3],
            [-3, 7, 2, -2],
            [4, 5, 4, 6],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          [
            [5, 3, 3, -1, 7],
            [-2, 4, 7, -1, 2],
            [-2, 5, 0, 2, 2],
            [5, 6, 5, 4, 6],
            [2, 7, -1, 4, 5],
          ],
        ],
        expected: 4,
      },
      {
        args: [
          [
            [-2, 5, -1],
            [2, -1, 2],
            [6, 7, 4],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          [
            [5, 2, 0, -1, 1],
            [1, 7, 3, 7, -2],
            [-2, 3, 6, 7, -2],
            [2, -2, 4, -2, 3],
            [4, 5, -1, 6, 7],
          ],
        ],
        expected: -8,
      },
      {
        args: [
          [
            [2, 4, -3, -2, 2],
            [2, 3, -3, 0, 4],
            [-2, -3, 5, 4, 4],
            [1, 7, 0, 0, -3],
            [-1, -3, 0, -3, 1],
          ],
        ],
        expected: -13,
      },
      {
        args: [[[5]]],
        expected: 5,
      },
      {
        args: [[[-2]]],
        expected: -2,
      },
      {
        args: [
          [
            [-1, 4, 4, 4],
            [-1, 5, 0, -2],
            [2, 4, 0, 2],
            [6, 0, 1, 2],
          ],
        ],
        expected: -3,
      },
      {
        args: [
          [
            [-1, 2, 0, 0],
            [-1, 3, 4, -1],
            [4, -3, 2, -1],
            [2, 2, 0, 0],
          ],
        ],
        expected: -5,
      },
    ],
    92: [
      {
        args: [[0, 4, 2]],
        expected: [0, 1],
      },
      {
        args: [[0, 0, 1, -3, 4, -2, -3]],
        expected: [0, 1, 2, 4],
      },
      {
        args: [[2, -1, -1, 2, -5, -1]],
        expected: [1, 2, 3],
      },
      {
        args: [[-4, 0, 1, -5]],
        expected: [0, 1, 2],
      },
      {
        args: [[4, -1, 4, 3, -2, -5]],
        expected: [0, 2],
      },
      {
        args: [[4, 1, 0, -5, 1, 4]],
        expected: [1, 4, 5],
      },
      {
        args: [[0, 4, 2, -1, -2]],
        expected: [0, 1],
      },
      {
        args: [[-5, 2, 5]],
        expected: [0, 1, 2],
      },
      {
        args: [[3, 3, 1, -5, 5, -2, 4]],
        expected: [0, 1, 4],
      },
      {
        args: [[2, 0, 1, -4, -3, 4]],
        expected: [1, 2, 5],
      },
      {
        args: [[-4]],
        expected: [0],
      },
      {
        args: [[4, 2, -3, -3, -4]],
        expected: [2, 3],
      },
    ],
    93: [
      {
        args: [[0, -5, 1, -5], 3],
        expected: 1,
      },
      {
        args: [[-1], 0],
        expected: 1,
      },
      {
        args: [[-5, 2, 3, 4], 7],
        expected: 3,
      },
      {
        args: [[4, -4, -3, 2, -3], 6],
        expected: 4,
      },
      {
        args: [[-3, -2, 0, 4], 2],
        expected: 2,
      },
      {
        args: [[3, 2], 1],
        expected: 2,
      },
      {
        args: [[1, -1], 7],
        expected: 2,
      },
      {
        args: [[-5, -5, 2], 0],
        expected: 2,
      },
      {
        args: [[], 7],
        expected: 0,
      },
      {
        args: [[5, 4, 5, 3, 0, -2], 6],
        expected: 5,
      },
      {
        args: [[], 3],
        expected: 0,
      },
      {
        args: [[2, 4, 2, 4, -4], 2],
        expected: 4,
      },
    ],
    94: [
      {
        args: [[[-4, -2]], 1],
        expected: 2,
      },
      {
        args: [
          [
            [-2, 6],
            [0, 2],
            [-2, 3],
            [-1, 5],
            [-2, 4],
          ],
          3,
        ],
        expected: 6,
      },
      {
        args: [
          [
            [1, 4],
            [-3, -1],
            [3, 4],
            [3, 4],
          ],
          3,
        ],
        expected: 1,
      },
      {
        args: [
          [
            [4, 6],
            [-4, -2],
          ],
          3,
        ],
        expected: 0,
      },
      {
        args: [[[-3, -3]], 3],
        expected: 0,
      },
      {
        args: [
          [
            [-3, 1],
            [-3, -1],
            [5, 6],
            [-3, -3],
            [-1, 6],
          ],
          2,
        ],
        expected: 5,
      },
      {
        args: [
          [
            [1, 4],
            [-4, 1],
            [-2, 1],
          ],
          1,
        ],
        expected: 8,
      },
      {
        args: [
          [
            [4, 5],
            [1, 2],
            [-3, 1],
            [-4, -2],
            [-2, 5],
          ],
          4,
        ],
        expected: 0,
      },
      {
        args: [
          [
            [-1, 6],
            [6, 6],
            [4, 5],
            [-1, -1],
          ],
          4,
        ],
        expected: 0,
      },
      {
        args: [
          [
            [1, 2],
            [0, 2],
            [-2, 6],
            [-2, 1],
            [-4, 3],
          ],
          4,
        ],
        expected: 2,
      },
      {
        args: [[[1, 3]], 2],
        expected: 0,
      },
      {
        args: [
          [
            [-3, -1],
            [-1, -1],
            [-1, 0],
            [-4, -2],
          ],
          2,
        ],
        expected: 1,
      },
    ],
    95: [
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          6,
          [
            [1, 0],
            [5, 3],
            [4, 4],
          ],
        ],
        expected: 2,
      },
      {
        args: [3, []],
        expected: 0,
      },
      {
        args: [4, []],
        expected: 2,
      },
      {
        args: [
          3,
          [
            [2, 2],
            [2, 2],
            [1, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [6, [[4, 5]]],
        expected: 3,
      },
      {
        args: [
          5,
          [
            [4, 0],
            [0, 4],
          ],
        ],
        expected: 6,
      },
      {
        args: [
          5,
          [
            [4, 4],
            [3, 2],
            [0, 4],
          ],
        ],
        expected: 5,
      },
      {
        args: [
          5,
          [
            [2, 3],
            [4, 1],
            [0, 0],
          ],
        ],
        expected: 4,
      },
      {
        args: [5, []],
        expected: 10,
      },
      {
        args: [
          3,
          [
            [1, 2],
            [1, 0],
            [0, 2],
          ],
        ],
        expected: 0,
      },
    ],
    96: [
      {
        args: [5, 1, -3, 15, 12],
        expected: 8,
      },
      {
        args: [-2, -3, 1, 12, 4],
        expected: 2,
      },
      {
        args: [-3, -2, 3, 3, 12],
        expected: 9,
      },
      {
        args: [3, -2, -2, 5, 2],
        expected: 0,
      },
      {
        args: [-3, -1, -1, 9, 12],
        expected: 2,
      },
      {
        args: [-5, 0, 1, 12, 1],
        expected: 0,
      },
      {
        args: [4, 3, 2, 5, 13],
        expected: 5,
      },
      {
        args: [-3, 3, -2, 12, 13],
        expected: 10,
      },
      {
        args: [4, 2, -1, 8, 13],
        expected: 2,
      },
      {
        args: [5, 2, 1, 11, 2],
        expected: 1,
      },
      {
        args: [5, 2, 1, 13, 1],
        expected: 0,
      },
      {
        args: [-2, 1, 0, 2, 6],
        expected: 4,
      },
    ],
    97: [
      {
        args: [[1]],
        expected: 0,
      },
      {
        args: [[2]],
        expected: 0,
      },
      {
        args: [[5, 5, 1, 4, 2]],
        expected: 4,
      },
      {
        args: [[0, 2, 5]],
        expected: 3,
      },
      {
        args: [[0, 5, 1, 1]],
        expected: 2,
      },
      {
        args: [[5, 4, 5, 1, 1, 1, 1]],
        expected: 10,
      },
      {
        args: [[1, 3, 3, 1, 4, 0]],
        expected: 7,
      },
      {
        args: [[4, 1, 5, 3, 5, 4, 5]],
        expected: 4,
      },
      {
        args: [[3]],
        expected: 0,
      },
      {
        args: [[5, 1, 4, 2, 4, 1]],
        expected: 8,
      },
      {
        args: [[5, 3]],
        expected: 0,
      },
      {
        args: [[4, 2, 2, 2, 4, 2, 5]],
        expected: 4,
      },
    ],
    98: [
      {
        args: [8, 4, 11],
        expected: 5,
      },
      {
        args: [8, 8, 13],
        expected: 0,
      },
      {
        args: [0, 0, 16],
        expected: 1,
      },
      {
        args: [4, -1, 2],
        expected: 0,
      },
      {
        args: [1, 2, 4],
        expected: 0,
      },
      {
        args: [6, 7, 5],
        expected: 0,
      },
      {
        args: [8, 5, 13],
        expected: 0,
      },
      {
        args: [2, 3, 10],
        expected: 0,
      },
      {
        args: [5, 0, 13],
        expected: 1,
      },
      {
        args: [3, 3, 3],
        expected: 0,
      },
      {
        args: [5, -1, 13],
        expected: 0,
      },
      {
        args: [1, 1, 1],
        expected: 0,
      },
    ],
    99: [
      {
        args: [[0], 89, 67],
        expected: 0,
      },
      {
        args: [[-3, 1, -1, 3, 2], 29, 64],
        expected: -1,
      },
      {
        args: [[3, 1, -4, -5], 59, 1],
        expected: -4,
      },
      {
        args: [[0, -2, -3, -3], 68, 72],
        expected: -2,
      },
      {
        args: [[0], 78, 40],
        expected: 0,
      },
      {
        args: [[1, -4, 5], 44, 82],
        expected: -4,
      },
      {
        args: [[-2, -1, 0, 4, -5, 0], 100, 91],
        expected: 4,
      },
      {
        args: [[4, 4, 1, -5, -1, 0, 1], 41, 10],
        expected: 0,
      },
      {
        args: [[-2, -3, 1, -1, 3, 0, 0], 56, 18],
        expected: 0,
      },
      {
        args: [[3, 0, 0, 0, 3], 15, 94],
        expected: 0,
      },
      {
        args: [[0], 17, 91],
        expected: 0,
      },
      {
        args: [[0, -4, 5, 1, 4, 3], 94, 59],
        expected: 4,
      },
    ],
    100: [
      {
        args: [4, [[2, 1]]],
        expected: 3,
      },
      {
        args: [
          4,
          [
            [2, 2],
            [3, 2],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          2,
          [
            [1, 1],
            [1, 0],
            [0, 1],
            [1, 0],
            [0, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [1, []],
        expected: 1,
      },
      {
        args: [
          1,
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [5, [[4, 0]]],
        expected: 4,
      },
      {
        args: [
          2,
          [
            [1, 0],
            [1, 0],
            [1, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          2,
          [
            [0, 1],
            [1, 1],
            [1, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [
          3,
          [
            [1, 0],
            [0, 2],
            [1, 0],
            [2, 2],
            [1, 2],
            [2, 0],
          ],
        ],
        expected: 1,
      },
      {
        args: [4, []],
        expected: 4,
      },
      {
        args: [
          5,
          [
            [3, 2],
            [2, 1],
          ],
        ],
        expected: 4,
      },
    ],
    101: [
      {
        args: [
          [0],
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 0,
      },
      {
        args: [
          [2, 5, 8, 2, 1],
          [
            [2, 1],
            [0, 2],
            [3, 4],
            [3, 2],
            [1, 1],
          ],
        ],
        expected: 9,
      },
      {
        args: [
          [6, 2],
          [
            [1, 0],
            [0, 0],
            [0, 1],
          ],
        ],
        expected: 6,
      },
      {
        args: [[7, 2, 6, 2], []],
        expected: 0,
      },
      {
        args: [
          [5, 4, 8, 8],
          [
            [2, 2],
            [2, 3],
          ],
        ],
        expected: 8,
      },
      {
        args: [
          [3, 3, 4, 7, 8],
          [
            [2, 4],
            [3, 1],
            [4, 1],
            [1, 2],
            [0, 0],
            [2, 2],
          ],
        ],
        expected: 10,
      },
      {
        args: [[5, 7], [[1, 1]]],
        expected: 7,
      },
      {
        args: [
          [0, 3, 2, 6],
          [
            [1, 3],
            [2, 1],
            [1, 1],
            [3, 0],
            [1, 3],
          ],
        ],
        expected: 3,
      },
      {
        args: [
          [7, 4],
          [
            [1, 0],
            [0, 1],
            [0, 0],
            [0, 0],
          ],
        ],
        expected: 7,
      },
      {
        args: [
          [2, 8, 1, 6, 3],
          [
            [3, 3],
            [1, 0],
            [3, 0],
            [2, 4],
            [3, 3],
          ],
        ],
        expected: 9,
      },
      {
        args: [
          [3, 2, 6],
          [
            [0, 2],
            [1, 1],
            [1, 2],
            [1, 0],
            [2, 2],
          ],
        ],
        expected: 8,
      },
      {
        args: [
          [7, 6, 6, 5],
          [
            [1, 3],
            [3, 1],
            [2, 3],
            [3, 2],
            [3, 3],
            [1, 1],
          ],
        ],
        expected: 11,
      },
    ],
    102: [
      {
        args: [[[3, 6, 0]], 3],
        expected: 0,
      },
      {
        args: [
          [
            [-2, 4, 4],
            [-2, 1, 2],
            [3, 5, 1],
            [-3, 5, 7],
            [-1, 2, 2],
          ],
          3,
        ],
        expected: 7,
      },
      {
        args: [[], 4],
        expected: 0,
      },
      {
        args: [[], 2],
        expected: 0,
      },
      {
        args: [
          [
            [-4, -3, 4],
            [-3, 4, -3],
            [-3, 2, 1],
            [0, 6, 0],
          ],
          0,
        ],
        expected: 0,
      },
      {
        args: [
          [
            [3, 7, 5],
            [-3, 6, 7],
            [4, 6, 1],
            [0, 4, 5],
            [-3, -1, 6],
          ],
          2,
        ],
        expected: 11,
      },
      {
        args: [
          [
            [-1, 7, 6],
            [-4, -1, 5],
          ],
          0,
        ],
        expected: 0,
      },
      {
        args: [
          [
            [-2, 6, -3],
            [-1, 2, 2],
          ],
          3,
        ],
        expected: 2,
      },
      {
        args: [
          [
            [0, 5, 5],
            [0, 1, 3],
            [3, 7, -2],
          ],
          3,
        ],
        expected: 5,
      },
      {
        args: [
          [
            [-3, 3, -2],
            [-4, 3, -2],
          ],
          2,
        ],
        expected: 0,
      },
      {
        args: [
          [
            [1, 7, 7],
            [-4, 4, -1],
            [4, 5, 7],
            [1, 7, 8],
          ],
          2,
        ],
        expected: 8,
      },
      {
        args: [[[-4, -3, -1]], 2],
        expected: 0,
      },
    ],
    103: [
      {
        args: ["AaBBaB", []],
        expected: [],
      },
      {
        args: ["a", ["A"]],
        expected: [0, 0],
      },
      {
        args: ["bAAaA", [""]],
        expected: [0, 0],
      },
      {
        args: ["abAA", ["abBa", "ABa", "BBbBBa", "B"]],
        expected: [2, 0],
      },
      {
        args: ["aABB", []],
        expected: [],
      },
      {
        args: ["Aba", []],
        expected: [],
      },
      {
        args: ["Aa", []],
        expected: [],
      },
      {
        args: ["AAabbA", ["AaBaa", "bbB", "AAAAba"]],
        expected: [3, 2],
      },
      {
        args: ["AbAB", ["aBaB", "", "a", "BAba"]],
        expected: [2, 3],
      },
      {
        args: ["bAaA", ["ABaAAb", "Ba", "Abb", "a"]],
        expected: [3, 0],
      },
      {
        args: ["BAB", []],
        expected: [],
      },
      {
        args: ["AaB", ["bBAA", "BbBb", "aBa"]],
        expected: [2, 2],
      },
    ],
    104: [
      {
        args: [[[0, 0, 1]]],
        expected: 1,
      },
      {
        args: [[[1], [1]]],
        expected: 1,
      },
      {
        args: [[[], []]],
        expected: 0,
      },
      {
        args: [[[]]],
        expected: 0,
      },
      {
        args: [
          [
            [0, 1],
            [0, 1],
          ],
        ],
        expected: 1,
      },
      {
        args: [[[1, 1]]],
        expected: 1,
      },
      {
        args: [[[1], [0]]],
        expected: 0,
      },
      {
        args: [[[0], [1]]],
        expected: 1,
      },
      {
        args: [[[1, 1, 1]]],
        expected: 2,
      },
      {
        args: [
          [
            [1, 1, 0],
            [0, 1, 1],
          ],
        ],
        expected: 2,
      },
      {
        args: [[[0, 0, 0]]],
        expected: 0,
      },
      {
        args: [[[0]]],
        expected: 0,
      },
    ],
    105: [
      {
        args: [-6, 4, -9, 5],
        expected: 6,
      },
      {
        args: [-9, 2, 8, 3],
        expected: 5,
      },
      {
        args: [5, 3, 5, 4],
        expected: 5,
      },
      {
        args: [6, 3, -2, 5],
        expected: 3,
      },
      {
        args: [8, 4, 4, 5],
        expected: 4,
      },
      {
        args: [-2, 3, 9, 4],
        expected: 1,
      },
      {
        args: [-2, 5, -7, 7],
        expected: 28,
      },
      {
        args: [-5, 4, -6, 5],
        expected: 19,
      },
      {
        args: [4, 4, -3, 5],
        expected: 12,
      },
      {
        args: [9, 3, -9, 4],
        expected: 3,
      },
      {
        args: [9, 4, 3, 5],
        expected: 13,
      },
      {
        args: [-5, 3, 0, 5],
        expected: 10,
      },
    ],
    106: [
      {
        args: [[[0, -3]]],
        expected: 0,
      },
      {
        args: [[[1, 2]]],
        expected: 0,
      },
      {
        args: [
          [
            [0, -3],
            [-3, 0],
            [1, 0],
            [2, 2],
            [-1, 0],
            [2, -3],
          ],
        ],
        expected: 34,
      },
      {
        args: [
          [
            [0, -2],
            [-3, -1],
            [3, -1],
          ],
        ],
        expected: 36,
      },
      {
        args: [
          [
            [-1, -2],
            [-2, 3],
          ],
        ],
        expected: 26,
      },
      {
        args: [
          [
            [0, 0],
            [0, -3],
            [1, -3],
            [3, -3],
            [1, -1],
            [-2, -1],
            [1, 3],
          ],
        ],
        expected: 40,
      },
      {
        args: [
          [
            [3, 2],
            [2, 3],
          ],
        ],
        expected: 2,
      },
      {
        args: [
          [
            [0, -1],
            [3, 3],
            [-2, 1],
            [1, -3],
            [-1, -2],
          ],
        ],
        expected: 41,
      },
      {
        args: [
          [
            [-3, -1],
            [2, 1],
          ],
        ],
        expected: 29,
      },
      {
        args: [[[3, -2]]],
        expected: 0,
      },
      {
        args: [
          [
            [0, 2],
            [-3, -2],
            [-3, 1],
            [2, -2],
            [-1, 2],
            [-2, -1],
          ],
        ],
        expected: 34,
      },
      {
        args: [[[-1, -2]]],
        expected: 0,
      },
    ],
    107: [
      {
        args: ["ba", 4],
        expected: [],
      },
      {
        args: ["AaAaA", 5],
        expected: [],
      },
      {
        args: ["Baa", -1],
        expected: [],
      },
      {
        args: ["BA", -1],
        expected: [],
      },
      {
        args: ["BabaaB", 7],
        expected: [],
      },
      {
        args: ["", 7],
        expected: [],
      },
      {
        args: ["A", -1],
        expected: [],
      },
      {
        args: ["bbb", 1],
        expected: ["b"],
      },
      {
        args: ["aaaab", -1],
        expected: [],
      },
      {
        args: ["AabbBA", 8],
        expected: [],
      },
      {
        args: ["", 5],
        expected: [],
      },
      {
        args: ["", 1],
        expected: [],
      },
    ],
  },
};
