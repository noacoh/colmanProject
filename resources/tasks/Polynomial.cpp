#include "Polynomial.h"

Polynomial::Polynomial(const Polynomial & p) : _arr(NULL), _size(p._size)
{
	*this = p;
}

void Polynomial::addMon(const Monomial & m)
{
	Polynomial newPoly;
	_size++;
	newPoly._arr = new Monomial[_size];

	for (int i = 0; i < _size - 1; i++) {
		newPoly._arr[i] = _arr[i];
	}
	newPoly._arr[_size - 1] = m;

	delete[] _arr;
	_arr = newPoly._arr;
	newPoly._arr = NULL;
}

void Polynomial::deleteZero()
{
	int count = 0, index = -1;
	Polynomial newPoly;

	for (int i = 0; i < _size; i++) {
		if (_arr[i].getCoeff() == 0)
			count++;
	}
	newPoly._arr = new Monomial[_size - count];
	newPoly._size = _size - count;
	for (int i = 0; i < _size; i++) {
		if (_arr[i].getCoeff() != 0)
			newPoly._arr[newPoly.FirstEmpty()] = _arr[i];
	}

	delete[] _arr;
	_arr = newPoly._arr;
	_size = _size - count;
	newPoly._arr = NULL;
}
int Polynomial::FirstEmpty()
{
	for (int i = 0; i <= _size; i++) {
		if ((_arr[i].getCoeff() == 0) && (_arr[i].getExp() == 0))
			return i;
	}
	return -1;
}

int Polynomial::maxExp() const
{
	int max = 0;
	for (int i = 0; i < this->_size; i++)
	{
		if (max < this->_arr[i].getExp())
			max = this->_arr[i].getExp();
	}
	if (max == 0)
		return -1;
	else
		return max;
}

void Polynomial::sort()
{
	Monomial tempMon;
	for (int i = 0; i < _size; i++)
		for (int j = i + 1; j < _size; j++)
			if (_arr[i].getExp() < _arr[j].getExp()) {	
				tempMon = _arr[i];
				_arr[i] = _arr[j];
				_arr[j] = tempMon;}
}
/*
char * Polynomial::getStringRepresentation() const
{
	stringstream poly;
	char* nPoly;
	for (int i = 0; i < this->_size; i++)
	{
		if (i != 0 && this->_arr[i].getCoeff() > 0)
			poly << '+' << this->_arr[i].getStringRepresentation();
	}
	nPoly = strdup(poly.str().c_str());
	
	return nPoly;
}
*/
char * Polynomial::getStringRepresentation() const
{
	stringstream str;

	if (_size == 0) {
		str << "0";
		char* newStr = strdup(str.str().c_str());
		return newStr;

	}
	else {
		str << (_arr[0].getStringRepresentation());
		for (int i = 1; i < _size; i++) {
			if (_arr[i].getCoeff() > 0)
			{
				str << "+";
				str << (_arr[i].getStringRepresentation());
			}
			else if (_arr[i].getCoeff() == 0)
				continue;
			else
				str << (_arr[i].getStringRepresentation());

		}
	}
	char* newStr = strdup(str.str().c_str());
	return newStr;
}
const Polynomial & Polynomial::operator=(const Polynomial& p)
{
	if (_arr != p._arr)
	{
		delete[] _arr;
		_size = p._size;
		_arr = new Monomial[_size];
		for (int i = 0; i < _size; i++) { _arr[i] = p._arr[i]; }
	}
	return *this;
}


/*
const Polynomial & Polynomial::operator+=(const Polynomial & p)
{
	if (this->_arr == NULL)
	{
		*this = p;
		return *this;
	}
	for (int i = 0; i < p._size; i++)
	{
		*this += p._arr[i];
	}
	return *this;
}
*/
const Polynomial & Polynomial::operator*=(const Monomial & m)
{
	int i;

	for (i = 0; i < _size; i++) {
		_arr[i] *= m;
	}
	return *this;
}

const Polynomial & Polynomial::operator-=(const Monomial & m)
{

	bool flagNotExist = false, flagZero = false;
	Polynomial newPoly;
	Monomial temp(m.getCoeff()*(-1), m.getExp());

	for (int i = 0; i < _size; i++) {

		if (_arr[i].getExp() == m.getExp())
		{
			_arr[i].setCoeff(_arr[i].getCoeff() - m.getCoeff());
			flagNotExist = true;
		}
	}

	if (flagNotExist == false) {

		addMon(temp);
	}
	else
	{
		for (int i = 0; i < _size; i++) {

			if (_arr[i].getCoeff() == 0)
				flagZero = true;
		}
		if (flagZero == true)
			deleteZero();
	}

	return *this;
}
const Polynomial & Polynomial::operator+=(const Monomial & m)
{
	bool flagNotExist = false, flagZero = false;
	Polynomial newPoly;

	for (int i = 0; i < _size; i++) {

		if (_arr[i].getExp() == m.getExp())
		{
			_arr[i].setCoeff(_arr[i].getCoeff() + m.getCoeff());
			flagNotExist = true;
		}
	}

	if (flagNotExist == false) {
		addMon(m);
	}
	else
	{
		for (int i = 0; i < _size; i++) {

			if (_arr[i].getCoeff() == 0)
				flagZero = true;
		}
		if (flagZero == true)
			deleteZero();
	}

	return *this;
}

const Polynomial & Polynomial::operator+=(const Polynomial & p)
{
	for (int i = 0; i < p._size; i++)
		*this += p._arr[i];
	return *this;
}

const Polynomial & Polynomial::operator-=(const Polynomial & p)
{

	for (int i = 0; i < p._size; i++)
		*this -= p._arr[i];
	return *this;
}

const Polynomial & Polynomial::operator*=(const Polynomial & p)
{
	int i, biggerPoly = _size;
	Polynomial temp1;
	temp1 = *this * p._arr[0];
	for (i = 1; i < p._size; i++) {
		temp1 += ((*this)* p._arr[i]);
	}
	*this = temp1;
	return *this;
}
/*
const Polynomial & Polynomial::operator+(const Monomial & m) const
{
	Polynomial* newP;
	newP = new Polynomial;
	bool flag = false;
	memcpy(newP, this, sizeof(Polynomial));
	for (int i = 0; i < this->_size; i++)
	{
		if (m.getExp() == this->_arr[i].getExp())
		{
			newP->_arr[i] += m;
			flag = true;
		}
	}
	if (flag == false)
	{
		myRealloc(newP, newP->_size, newP->_size + 1);
		newP->_arr[newP->_size] = m;
	}
	return *newP;
}
*/
int Polynomial::operator[](int exp) const
{
	for (int i = 0; i < this->_size; i++)
	{
		if (this->_arr[i].getExp() == exp)
			return this->_arr[i].getCoeff();
	}
	return 0;
}

int Polynomial::countMonoms(const char * p)
{
	int i = 1, monoms = 0;
	if ((int)p[0] >= 48 && (int)p[0] <= 57)
		monoms++;
	while(p[i] != '\0')
	{
		if (p[i] == '+' || p[i] == '-')
			monoms++;
		else if (p[i] == 'x')
			monoms++;
		if (p[i] != '\0')
			i++;
	}
	return monoms;
}


void myRealloc(Polynomial *& oldPoly, int oldSize, int newSize)
{
	if (oldPoly == NULL)
		return;
	int i;
	Polynomial * newPoly = new Polynomial[newSize];
	for (i = 0; i < oldSize; i++)
	{
		newPoly[i] = oldPoly[i];
	}
	delete[] oldPoly;
	oldPoly = newPoly;
}

void myErase(Polynomial *& oldPoly, int polySize, int indexToErase)
{
	if (oldPoly == NULL)
		return;
	int i;
	int j = 0;
	Polynomial * newPoly = new Polynomial[--polySize];
	for (i = 0; i < polySize; i++)
	{
		if (i == indexToErase)
			j++;
		newPoly[i] = oldPoly[j++];
	}
	delete[] oldPoly;
	oldPoly = newPoly;
}

std::ostream & operator<<(std::ostream & out, const Polynomial & p)
{
	out << p.getStringRepresentation();
	return out;
}
	
Polynomial & Polynomial::operator>>(const char * str)
{
	int signFlag = 1, i = 0, j = 0, k = 0;;
	bool flag = false;
	Polynomial newPoly;
	int newSize = countMonoms(str);
	if (this->_arr != NULL)
		delete[] this->_arr;
	this->_arr = new Monomial[newSize];
	this->_arr[0].setCoeff(signFlag);
	while (str[i] != '\0' && j < newSize)
	{
		if (str[i] == '+' || str[i] == '-')
		{
			if (str[i] == '-')
				signFlag = -1;
			else
				signFlag = 1;
			if (i != 0)
				j++;
			this->_arr[j].setCoeff(signFlag);
			flag = false;
			k = 0;
		}
		else if (str[i] == 'x')
		{
			flag = true;
			k = 0;
			this->_arr[j].setExp(1);
		}
		else if (str[i] == '^')
		{
			i++;
			continue;
		}
		else
		{
			k = k * 10 + (str[i] - '0');
			if (!flag)
				this->_arr[j].setCoeff(k*signFlag);
			else
				this->_arr[j].setExp(k);
		}
		i++;
	}
	this->_size = newSize;
	newPoly += *this;
	*this = newPoly;
	return *this;
}


Polynomial operator*(const Polynomial & p1, const Polynomial & p2)
{
	Polynomial newPoly;
	newPoly = p1;
	newPoly *= p2;
	return newPoly;
}

Polynomial operator+(const Polynomial & p1, const Polynomial & p2)
{
	Polynomial newPoly;
	newPoly = p1;
	newPoly += p2;
	return newPoly;
}

Polynomial operator-(const Polynomial & p1, const Polynomial & p2)
{
	Polynomial newPoly;
	newPoly = p1;
	newPoly -= p2;
	return newPoly;
}

Polynomial operator*(const Polynomial & p1, const Monomial & m)
{
	Polynomial newPoly = p1;

	newPoly *= m;

	return newPoly;
}

Polynomial operator*(const Monomial & m, const Polynomial & p1)
{
	return p1*m;
}

Polynomial operator+(const Polynomial & p1, const Monomial & m)
{
	Polynomial newPoly;
	newPoly = p1;
	newPoly += m;
	return newPoly;
}

Polynomial operator+(const Monomial & m, const Polynomial & p1)
{
	return (p1 + m);
}

Polynomial operator-(const Polynomial & p1, const Monomial & m)
{
	Polynomial newPoly;
	newPoly = p1;
	newPoly -= m;
	return newPoly;
}

Polynomial operator-(const Monomial & m, const Polynomial & p1)
{
	int i;
	Polynomial newPoly(p1);
	newPoly -= m;
	for (i = 0; i < newPoly._size; i++) {
		newPoly._arr[i].setCoeff(newPoly._arr[i].getCoeff()*(-1));
	}
	return newPoly;
}
