#include <iostream>
#include <stdlib.h>
#include <math.h>

using namespace std;

int main() {
    const int seed = 9327;
    const int n1 = (seed / 1000), n2 = (seed / 100 - n1 * 10),
    n3 = (seed / 10 - n1* 100 - n2 * 10),
    n4 = seed - n1 * 1000 - n2 * 100 - n3 * 10;
    const double koef = 1 - n3*0.01 - n4*0.01 - 0.3;
    const int n = 12;
    int A[12][12];
    srand (9327);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            const float rand1 = ((double) rand() / (RAND_MAX));
            const float rand2 = ((double) rand() / (RAND_MAX));
            //cout << "rand1: " << rand1 << "rand2: " << rand2 << endl;
            A[i][j] = round((rand1 + rand2) * koef);
        }
    }
    cout << "[" << endl;
    for (int i = 0; i < n; i++) {
        cout << "[";
        for (int j = 0; j < n; j++) {
            if (j == 11)
                cout<< A[i][j];
            else
                cout<< A[i][j] << ", ";
        }
        cout<< "]," <<endl;
    }
    cout << "]" << endl;
};



/*
 function buildArr() {
    const A = [];

    for (let index = 0; index < n; index++) {
      const ryad = [];
      for (let pos = 0; pos < n; pos++) {
        let rand1 = Math.random();
        let rand2 = Math.random();
        const val = Math.trunc(koef * (rand1 + rand2));
        ryad.push(Math.trunc(val));
      }
      A.push(ryad);
    }
    return A;
  }
 */
