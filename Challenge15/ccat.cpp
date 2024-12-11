#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int number = 0;

void sampleRead(istream &input, char att) {
    string line;
    while (getline(input, line)) {
        if (att == 'n' || (att == 'b' && line != "")) {
            number++;
            cout << number << ". " << line << endl;
        } else {
            cout << line << endl;
        }
    }
}

int main(int argc, char *argv[]) {
    char att = '\0';

    if (argc > 1 && argv[1][0] == '-') {
        att = argv[1][1]; // Get the attribute
        for (int i = 2; i < argc; i++) {
            ifstream file(argv[i]);
            if (file.is_open()) {
                sampleRead(file, att);
                file.close();
            } else {
                cerr << "Error: Unable to open file " << argv[i] << endl;
            }
        }
    } else if (argc > 1) {
        for (int i = 1; i < argc; i++) {
            ifstream file(argv[i]);
            if (file.is_open()) {
                sampleRead(file, att);
                file.close();
            } else {
                cerr << "Error: Unable to open file " << argv[i] << endl;
            }
        }
    } else {
        // Read from standard input
        sampleRead(cin, att);
    }

    return 0;
}
