#include "Monomial.h"



//Constructor
Monomial::Monomial(int coeff, int exp) : _coeff(0), _exp(0)
{
	_coeff = coeff;
	if (exp > 0)
		_exp = exp;
}
//Default constructor
Monomial::Monomial():_coeff(0), _exp(0)
{
}
int Monomial::setCoeff(int coeff)
{
	_coeff = coeff;
	return 0;
}
int Monomial::setExp(int exp)
{
	_exp = exp;
	return 0;
}
//Overload of Operator += for 
const Monomial & Monomial::operator+=(const Monomial & m)
{
	if (_exp == m._exp)
	{
		_coeff += m._coeff; //summing coeffincients
	}
	return *this;
}
//Operator * : multiplication between two monomials (the calling object and the passing object) 
Monomial Monomial::operator*(const Monomial & m) const
{
	Monomial tmpMonomial;
	tmpMonomial._coeff = _coeff*m._coeff;
	tmpMonomial._exp = _exp+m._exp;
	return tmpMonomial;
}
//Operator *= : multiplication between two monomials (return value to the calling object)
const Monomial & Monomial::operator*=(const Monomial & m)
{
	_coeff *= m._coeff;
	_exp += m._exp;
	return *this;
}
//Operator of comparison between two monomials
int Monomial::operator==(const Monomial & m) const
{
	if (_coeff == m._coeff && _exp == m._exp)
		return 1;
	else
		return 0;
}
//negate  the sign of coefficent of monomial that calls this member function
void Monomial::negate()
{
	_coeff = -_coeff;
}
// Builing the string represenation of a Monom
char * Monomial::stringRepresentation() const
{
	string strMonom;

	if (_coeff == 0)//expression equals zero
		strMonom = "0";

	else if (_exp == 0) //degree equals zero
		strMonom = to_string(_coeff);

	// degree equals one
	else if (_exp == 1) {
		if (_coeff == 1)
			strMonom = "x";
		else if (_coeff == -1)
			strMonom = "-x";
		else
			strMonom = to_string(_coeff) + "x";
	}
	// coefficent equals one 
	else if (_coeff == 1)
		strMonom = "x^" + to_string(_exp);
	else if (_coeff == -1)
		strMonom = "-x^" + to_string(_exp);
	else //else
		strMonom = to_string(_coeff) + "x^" + to_string(_exp);


	char *strTmp = new char[strMonom.length() + 1];
	strcpy(strTmp, strMonom.c_str());
	return strTmp;

}
// Printing monomials according to format rules
std::ostream & operator<<(std::ostream & out, const Monomial & m)
{
	return out << m.stringRepresentation();
}
