#pragma once

#include <iostream>
#include <ostream>
#include <string.h>
#include <sstream>

using namespace std;

class Monomial
{
private:
	int _coeff, _exp;

public:
	Monomial(int coeff, int exp = 0) { this->setCoeff(coeff); this->setExp(exp); };
	Monomial() : _coeff(0), _exp(0) {};
    
    friend std::ostream& operator << (std::ostream& out, const Monomial& m);
    
	//get
	int getCoeff() const {return _coeff; }
	int getExp() const { return _exp; }

	//set
	void setCoeff(int const &coeff) { _coeff = coeff; }
	void setExp(int const &exp) { _exp = exp; }

	//operators
	Monomial& operator+=(const Monomial &m);
	Monomial operator*(const Monomial &m) const;
	Monomial& operator*=(const Monomial &m);
	bool operator==(const Monomial &m) const;
	Monomial& negate();
	char* getStringRepresentation() const;

	string sTo_string(int i) const;
};

std::ostream& operator<<(std::ostream& out, const Monomial& m);