#pragma once

#include <iostream>
#include "string.h" //not necessary
#include <string> 

using namespace std;

class Monomial
{
private:
	int _coeff;
	int _exp;
public:
	//Ctors Dtors
    Monomial(int coeff, int exp = 0);
    Monomial();
    
	//get set methods (inline)
	int getCoeff() const { return _coeff; }
	int getexp() const { return _exp; }
	int setCoeff(int coeff);
	int setExp(int exp);



	//Operators
	const Monomial& operator+=(const Monomial& m);
	Monomial operator* (const Monomial& m) const;
	const Monomial& operator*= (const Monomial& m);
	int operator== (const Monomial& m) const;

	void negate();


    friend std::ostream& operator << (std::ostream& out, const Monomial& m);
    
    char* stringRepresentation() const;
};

std::ostream& operator << (std::ostream& out, const Monomial& m);
