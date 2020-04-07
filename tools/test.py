import re
from re import Pattern, match
import os
import subprocess
import term

EXPECT = re.compile(r"// expect: ?(.*)")

TEST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../tests")


TESTS = {"tests/expressions.lox": True}


def get_expected_output(test_file):
    expected_outs = []
    with open(test_file, "r") as f:
        for line in f.readlines():
            match = EXPECT.search(line)
            if match:
                expected_outs.append(match.group(1))
    return expected_outs
    # expected_out = expected_out.group(0)


def find_tests():
    tests = []
    for path, subdirs, files in os.walk(TEST_DIR):
        for name in files:
            test_file = os.path.join(path, name)
            if test_file.endswith(".lox"):
                tests.append(test_file)

    return tests


def execute_tests(tests):
    passed = 0

    for test in tests:
        print(test)
        p = subprocess.Popen(["../ferrous", test], stdout=subprocess.PIPE)
        out = p.communicate()[0]
        out = out.split(b"\n")
        out = [o.decode("utf8") for o in out]

        # remove extra trailing \n
        if out[-1] == "":
            del out[-1]

        expected_outs = get_expected_output(test)

        if expected_outs == out:
            passed += 1
    return (passed, len(tests) - passed)


tests = find_tests()
term.writeLine(f"Found {len(tests)} tests to run:", term.cyan)
passed, failed = execute_tests(tests)

term.writeLine(f"Tests passed :[{passed}] ", term.green)
term.writeLine(f"Tests failed :[{failed}] ", term.red)
# print(tests, "..")

