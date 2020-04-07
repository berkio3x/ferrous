import re
from re import Pattern, match
import os
import subprocess

EXPECT = re.compile("// Expect.")
x = EXPECT.search("Hello // Expect. 22")

TEST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../tests")


def find_tests():
    tests = []
    for path, subdirs, files in os.walk(TEST_DIR):
        for name in files:
            test_file = os.path.join(path, name)
            if test_file.endswith(".lox"):

                tests.append(test_file)
    return tests


def execute_tests(tests):
    for test in tests:
        p = subprocess.Popen(["../ferrous", test], stdout=subprocess.PIPE)
        out = p.communicate()[0]
        print(out)


print(x)

tests = find_tests()
execute_tests(tests)
print(tests)

