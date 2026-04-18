#include <iostream>
#include <queue>
#include <string>
using namespace std;

// Structure to store patient details
struct Patient {
    string name;
    int age;
    int priority;  // Lower value = higher priority (e.g., 1 = Emergency, 2 = Normal)

    // Overload < operator for priority queue
    bool operator<(const Patient& p) const {
        return priority > p.priority;  // Min-Heap behavior
    }
};

int main() {
    priority_queue<Patient> hospitalQueue;
    int choice;

    do {
        cout << "\n=== Hospital Management System ===\n";
        cout << "1. Add Patient\n";
        cout << "2. Treat Patient\n";
        cout << "3. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        if (choice == 1) {
            Patient p;
            cout << "Enter patient's name: ";
            cin.ignore(); // clear buffer
            getline(cin, p.name);
            cout << "Enter age: ";
            cin >> p.age;
            cout << "Enter priority (1 = Emergency, 2 = Normal): ";
            cin >> p.priority;

            hospitalQueue.push(p);
            cout << "Patient added to the queue.\n";
        }
        else if (choice == 2) {
            if (!hospitalQueue.empty()) {
                Patient p = hospitalQueue.top();
                hospitalQueue.pop();
                cout << "Treating patient: " << p.name << " (Age: " << p.age << ", Priority: " << p.priority << ")\n";
            } else {
                cout << "No patients in the queue.\n";
            }
        }
        else if (choice != 3) {
            cout << "Invalid choice. Try again.\n";
        }

    } while (choice != 3);

    cout << "System exited.\n";
    return 0;
}