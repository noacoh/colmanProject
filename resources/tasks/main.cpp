#include"Monomial.h"
#include"Polynomial.h"
using namespace std;
void main()
{
	// =====================================// 
	//  M   O   N   O   M   I   A   L
	Monomial m(2, 2);
	Monomial m1(2, 2);
	m += m1;
	Monomial m2(m); // m2 = 2x
	
	cout << m2.getStringRepresentation() << endl; // cout<< 4x^6

	cout << "m: "<< m << endl << "m1 :" << m1 << endl << "m2: " << m2 << endl;
	Monomial m2_multiply_m1 = m2*m1; 
	cout << endl << m2_multiply_m1;  // 2x * 2x^2 = 4x^3
	Monomial m3(1, 3);
	m3 *= m2_multiply_m1;
	m3.negate();
	cout << endl << m3;   // x^3 * 4x^3 = 4x^6
	Monomial m4(-4, 6);
	Monomial m5(4, 6);
	
	 if (m3 == m5)
		cout <<endl<< "monom Op== work"<<endl;
	 m4.negate();
	 if (m3 == m4)
		 cout << "negate work"<<endl;
	 cout << m4.getStringRepresentation()<<endl; // cout<< 4x^6
	 Monomial m6;
	 Monomial m7(-1, 1);
	 Monomial m8(1, 6);
	 cout << m6.getStringRepresentation() << endl; //cout <<"0"
	 cout << m6 << endl;  //"0"
	 cout << m7.getStringRepresentation() << endl; //cout <<"-x"
	 cout << m7 << endl;
	 cout << m8.getStringRepresentation() << endl; //cout <<"x^6"
	 cout << m8 << endl;
	


	 // ====================== //
	 //    P   O   L   Y   N   O   M   I   A   L      
	 
	Polynomial p1, p2;
	p1 >> "2x^4+5x^2-3";
	p2 >> "-x^4";
	Polynomial p;
	p >> "-1x^1+x^4-3x^2+x^2"; // -x+x^4-2x^2
	cout << p<<endl;  // -x+x^4-2x^2
//	Polynomial p1(p);
	cout <<"p1(p): "<<endl<< p1.getStringRepresentation()<<endl; //-x+x^4-2x^2
	p1.sort();
	cout << "check if sorted:" << endl;
	cout << p1;  // x^4-2x^2-x
//	Polynomial p2;
	p2 >> "-x^4+3x^2+2x-2";
	p1 += p2;

	p1.sort();
	if (strcmp(p1.getStringRepresentation(), "x^4+8x^2+2x-5")==0)
		cout << " p1 += p2 done"<<endl;
	else
		cout << " p1 += p2 error" << endl;
	
		 Monomial m10(1, 4);
		 Monomial m11(-4, 4);
		 p2 += m10;
		 p2 += m11;
		 cout << p2;
		 p2.sort();
		
		 if (strcmp(p2.getStringRepresentation(),"-4x^4+3x^2+2x-2")==0)
			 cout<<endl<< "Op += poly+monom, done." << endl;
		 else
			 cout << endl << "Op += poly+monom, error." << endl;

		p1 -= p2;
		p1.sort();
		 if (strcmp(p1.getStringRepresentation(), "5x^4+5x^2-3") == 0)
			 cout << " OP -= poly-poly, done." << endl;
		 else
			 cout << endl << "OP -= poly-poly, error." << endl;

		 p1 -= m10;
		 if (strcmp(p1.getStringRepresentation(), "4x^4+5x^2-3") == 0)
			 cout << " OP -= poly-monom, done." << endl;
		 else
			 cout << endl << "OP -= poly-monom, error." << endl;

		 Polynomial p3;
		 p3 >> "-x^5+3x^3-x+2";

		 p1 *= p3;
		 p1.sort();
		 if (strcmp(p1.getStringRepresentation(), "-4x^9+7x^7+14x^5+8x^4-14x^3+10x^2+3x-6") == 0)
			 cout << endl << " OP *= poly*poly, done." << endl;
		 else
			 cout << endl << "OP *= poly*poly, error." << endl;

		 Monomial m12(-1, 1);
		 p1 *= m12;

		 if (strcmp(p1.getStringRepresentation(), "4x^10-7x^8-14x^6-8x^5+14x^4-10x^3-3x^2+6x") == 0)
			 cout << endl << " OP *= poly*monom, done." << endl;
		 else
			 cout << endl << "OP *= poly*monom, error." << endl;

		 if (p1[10] == 4 && p1[1] == 6)
			 cout << "OP [] done"<<endl;
		 else
			 cout << endl << "OP[] error."<<endl;

		 if (p1.maxExp() == 10 && p2.maxExp() == 4)
			 cout << endl << "maxExp() ---> done." << endl;
		 else
			 cout << "maxExp()---> error" << endl;

		 Polynomial p4 = p1 + p3;//
		 if (strcmp(p4.getStringRepresentation(), "4x^10-7x^8-14x^6-9x^5+14x^4-7x^3-3x^2+5x+2") == 0)
			 cout << endl << "global OP+ poly+poly, done." << endl;
		 else
			 cout << endl << "global OP+ poly+poly, error." << endl;
		 
		 Polynomial p5 = p1 - p3;
		 p5.sort();//-4x^10+7x^8+14x^6+7x^5-14x^4+13x^3+3x^2-7x+2
		 if (strcmp(p5.getStringRepresentation(), "4x^10-7x^8-14x^6-7x^5+14x^4-13x^3-3x^2+7x-2") == 0)
			 cout << endl << "global OP- poly-poly, done." << endl;
		 else
			 cout << endl << "global OP- poly-poly, error." << endl;

		 Polynomial p6,p7;
		 p6 >> "-x^4+2x^2-1";
		 p7 >> "x^2-1";

		 Polynomial p8 = p6*p7;
		 
		 
		 if (strcmp(p8.getStringRepresentation(), "-x^6+3x^4-3x^2+1") == 0)
			 cout << endl << "global OP* poly*poly, done." << endl;
		 else
			 cout << endl << "global OP* poly*poly, error." << endl;

		 Monomial m13(1, 6);
		 
		 Polynomial p9 = p8 + m13;
		 if (strcmp(p9.getStringRepresentation(), "3x^4-3x^2+1") == 0)
			 cout << endl << "global OP+ poly+monom, done." << endl;
		 else
			 cout << endl << "global OP+ monom+poly, done." << endl;
		 
		 Polynomial p10 = p8 - m13;
		 if (strcmp(p10.getStringRepresentation(), "-2x^6+3x^4-3x^2+1") == 0)
			 cout << endl << "global OP- poly-monom, done." << endl;

		 Polynomial p11 = m13 - p8;
		 if (strcmp(p11.getStringRepresentation(), "2x^6-3x^4+3x^2-1") == 0)
			 cout << endl << "global OP- monom-poly, done." << endl;
		 else
			 cout << endl << "global OP- monom-poly, error." << endl;




}

