#include "Monomial.h"


Monomial& Monomial::operator+=(const Monomial & m)
{
	if (this->getExp() == m.getExp()) {
		this->setCoeff(this->getCoeff() + m.getCoeff()); return *this;
	}
	else
		throw "Exponents aren't equal";
}

Monomial Monomial::operator*(const Monomial & m) const
{
	Monomial a = *this;
	a *= m;
	return a;
}

Monomial & Monomial::operator*=(const Monomial & m)
{
	this->setCoeff(this->getCoeff() * m.getCoeff());
	this->setExp(this->getExp()+m.getExp());
	return *this;
}

bool Monomial::operator==(const Monomial & m) const
{
	if ((this->getCoeff() == m.getCoeff()) && this->getExp() == m.getExp())
		return true;
	else
		return false;
}

Monomial & Monomial::negate()
{
	this->setCoeff(this->getCoeff()*(-1));
	return *this;
}

char* Monomial::getStringRepresentation() const
{
	stringstream monom;
	char* mon;
	switch(this->getCoeff())
	{
	case 0://if the coeff is 0, returned monom is 0
		monom << '0' << '\0';
		mon = strdup(monom.str().c_str());
		return mon;
	case 1://if the coeff is 1, exp is 0, return 1, if exp is 1 return X, if exp is different return X^(exp)
		if (this->getExp() == 0)
		{
			monom << '1' << '\0';
			mon = strdup(monom.str().c_str());
			return mon;
		}
		else if (this->getExp() == 1)
		{
			monom << 'x' << '\0';	
			mon = strdup(monom.str().c_str());
			return mon;
		}
		else {
			monom << "x^" << sTo_string(this->getExp()) << '\0';
			mon = strdup(monom.str().c_str());
			return mon;
		}

	case -1:
		if (this->getExp() == 0)
		{
			monom << "-1" << '\0';
			mon = strdup(monom.str().c_str());
			return mon;
		}
		else if (this->getExp() == 1)
		{
			monom << "-x" << '\0';
			mon = strdup(monom.str().c_str());
			return mon;
		}
		else {
			monom << "-x^" << sTo_string(this->getExp()) << '\0';
			mon = strdup(monom.str().c_str());
			return mon;
		}

	default://in case both coeff and exp different than 0, 1, return (coeff)x^(exp)
		if (this->getExp() == 0)
		{
			monom << sTo_string(this->getCoeff()) << '\0';
			mon = strdup(monom.str().c_str());
			return mon;
		}
		else if (this->getExp() == 1)
		{
			monom << sTo_string(this->getCoeff()) << 'x' << '\0';
			mon = strdup(monom.str().c_str());
			return mon;
		}
		else {
			monom << sTo_string(this->getCoeff()) << "x^" << sTo_string(this->getExp()) << '\0';
			mon = strdup(monom.str().c_str());
			return mon;
		}
	}
}

string Monomial::sTo_string(int i) const
{
	stringstream ss;
	ss << i;
	return ss.str();
}

std::ostream & operator<<(std::ostream & out, const Monomial & m)
{
	out << m.getStringRepresentation();
	return out;
}
