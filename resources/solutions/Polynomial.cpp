#include "Polynomial.h"
//assignment operator
const Polynomial& Polynomial::operator=(const Polynomial& p)
{
	if (&p != this) {
		delete[] _Monos;
		_size = p._size;
		_Monos = new Monomial[_size];
		for (int i = 0; i < _size; i++)
			_Monos[i] = p._Monos[i];
	}
	return *this;
}
const Polynomial & Polynomial::operator+=(const Polynomial & p)
{
	for (int i = 0; i < p._size; i++) {
			*this +=p._Monos[i];
	}
	return *this;
}

// Adding Monomial to a polynom, if the degree doesnt exist it adds it(using addMonom), if it zeros coefficent, it cancel it using (removeCoeffZero),(using += monomial operator)
const Polynomial & Polynomial::operator+=(const Monomial & m)
{
	for (int i = 0; i < _size; i++) {
		if (_Monos[i].getexp() == m.getexp()) {
			//Case adding the Monomial zeros the coefficent of the existing monomial of the same order
			if (_Monos[i].getCoeff() + m.getCoeff() == 0) {
				_Monos[i] = Monomial(0, m.getCoeff());
				removeCoeffZero(); 
				return *this; 
			}
			//adding coeeficents
			else {
				_Monos[i]+= m;
				return *this;
			}
		}

	}
	//Case there isnt a Monomial with a similar degree of the given Monomial
	addMonom(m);
	uniteExp();
	return *this;
}
// substracting polynom from polynom using  -= operator between polynom and Monomial
const Polynomial & Polynomial::operator-=(const Polynomial & p)
{
	for (int i = 0; i < p._size; i++) {
		*this -= p._Monos[i];
	}
	return *this;
}

//substracting Monomial from polynom using negate function and +=operator
const Polynomial & Polynomial::operator-=(const Monomial & m)
{
	Monomial a(m);
	a.negate();
	*this += a;
	return *this;
}


// Multiplying the polynom with given polynom (Monomial by Monomial) ,(using *= polynom operator)
const Polynomial & Polynomial::operator*=(const Polynomial & p)
{
	Polynomial* tmpPolyarr = new Polynomial[p._size]; //array of polynoms
	for (int j = 0; j < p._size; j++) {
		tmpPolyarr[j] = *this*p._Monos[j];
	}
	*this = tmpPolyarr[0];
	for (int j = 1; j < p._size; j++) {
		*this += tmpPolyarr[j];
	}
	return *this;
}


// Multiplying the polynom(Monomial by Monomial) with the given Monomial. (using *= monomial operator)
const Polynomial & Polynomial::operator*=(const Monomial & m)
{
	for (int i = 0; i < _size; i++) {
		_Monos[i] *= m;
	}

	uniteExp();
	return *this;
}


// return coefficent of monom with 'exp' degree ' if doesn't exist return 0;
int Polynomial::operator[](int exp) const
{
	for (int i = 0; i < _size; i++) {
		if (_Monos[i].getexp() == exp)
			return _Monos[i].getCoeff();
	}
	return 0;
}
//add monom of new order that does not exist on the polynom vector
void Polynomial::addMonom(const Monomial & m)
{
	_size++; //updating the size of the array
	Monomial* tmpArr = new Monomial[_size];
	for (int i = 0; i < _size-1; i++) {
		tmpArr[i] = _Monos[i];
	}
	tmpArr[_size-1] = m; //adding the new monomial to the end of the array
	delete[] _Monos; //deleting prvious allocation
	
	_Monos = new Monomial[_size];
	for (int i = 0; i < _size; i++) {
		_Monos[i]= tmpArr[i];
	}

}
// remove monos with 0 coefficent from polynom array
void Polynomial::removeCoeffZero()
{
	
	if (_size > 1)
	{
		Monomial* tmpArr = new Monomial[_size - 1];
		int index = 0;
		for (int i = 0; i < _size; i++) {
			if (_Monos[i].getCoeff() != 0) {
				tmpArr[index] = _Monos[i];
				index++;
			}

		}
		delete[] _Monos;
		_size--; //updating the size of the array
		_Monos = new Monomial[_size]; //new allocation
		for (int i = 0; i < _size; i++)
		{
			_Monos[i] = tmpArr[i];
		}
	}
}

Polynomial & Polynomial::operator >> (const char * str)
{
	int i = 0;
	int counter = 0;
	int length = strlen(str);
	//counts the number of Monomial in the polynom
	while (i<length) {
		if (str[i] == '+' || str[i] == '-') {
			counter++;
			}
		i++;
	}
	if (str[0] != '-') //in case the first monom is positive, so we need to add another monom to the counting
		counter++;

	if (_Monos != NULL)
		delete[] _Monos; //delete previous allocation
	_Monos = new Monomial[counter]; //dynamic allocation of the monomials array according to number of monomials in the polynom
	_size = counter;



	//reading each monomial,by spliitng the stirng and identify each monomial components
	//initalization
	i = 0;
	int index = 0;
	int coeffInd = -1;
	int expInd = -1;
	int coeff = 1;
	int exp;
	while (i < length) {
		if (str[i] == '+' || str[i] == '-') {
			index++;
			if (i == 0) //special case: the first monomial can be *negative* so we dont advance in the array location
				index--;
			i++;
		}
		else if (str[i] == 'x'){
			i++;
			_Monos[index] = Monomial(coeff, 1);
		}

		else if (str[i] == '^')
				i++;
		//its a number character
		else {
				if ((i > 0) && str[i - 1] == '^') {  //if its a number that represent an exponent
						exp = 0;
						while (i < length && (str[i] - '0' >= 0 && str[i] - '0' <= 9))
						{
							exp = exp * 10 + (str[i] - '0');
							i++;
						}
						expInd = index;
						if (coeffInd == expInd)
							_Monos[index] = Monomial(coeff, exp);
						else
							_Monos[index] = Monomial(1, exp);
				}
				else  { //the first number can only be coefficent
					coeff = 0;
					while ((i < length) && (str[i] - '0' >= 0 && str[i] - '0' <= 9))
					{
						coeff = coeff * 10 + (str[i] - '0');
						i++;
					}
					coeffInd = index;
					if ((i < length) && str[i] == 'x')
						_Monos[index] = Monomial(coeff, 1);
					else
						_Monos[index] = Monomial(coeff, 0);
				}
		}
	}
	//removeCoeffZero();
	//removeExpZero();
	//Finding negative monomials and changing their sign
	index = 0;
	i = 0;
	while (i < length) {
		if (str[i] == '-')
			if (i == 0) {
				_Monos[index].negate();
				i++;
				index++;
			}
			else {
				index++;
				_Monos[index].negate();
				i++;
			}
		else if (str[i] == '+') {
			index++;
			i++;
		}
		else
			i++;
		}
			

	//char *strTmp = new char[strlen(str) + 1];
	uniteExp();
	return *this;
}
//return the maximum degree in polynom if there are no monoms on polynom returns -1
int Polynomial::maxExp() const
{
	int max = 0;
	if (_Monos == NULL)
		return -1;
	for (int i=0; i < _size; i++) {
		if (_Monos[i].getexp() > max)
			max = _Monos[i].getexp();
	}
	return max;
}
char * Polynomial::getStringRepresentation() const
{
	//No monoms in the polynom
	if (_size == 0)
		return "0";
	string strMonom= "";
	for (int i = 0; i < _size; i++) {
		if (i != 0 && _Monos[i].getCoeff() > 0)
			strMonom += "+";
		strMonom += _Monos[i].stringRepresentation();
	}
	
	char *strTmp = new char[strMonom.length() + 1];
	strcpy(strTmp, strMonom.c_str());
	return strTmp;

}
void Polynomial::uniteExp()
{
	for (int i = 0; i < _size-1; i++) {
		for (int j = i+1; j < _size; j++) {
			if (_Monos[i].getexp() == _Monos[j].getexp()) {
					_Monos[i] += _Monos[j];
					_Monos[j] = Monomial(0,0);
					removeCoeffZero();
			}
		}

	}
}
//Sort the monomials of a polynom according to their degree from the highest degree in the first cell in the vector to the lowest degree in the last cell 
void Polynomial::sort()
{
	Monomial m;
	for (int j = _size - 1; j >= 0 - 1; j--) {
		for (int i = 0; i <= j - 1; i++) {
			//swap
			if (_Monos[i + 1].getexp() > _Monos[i].getexp()) {
				m = _Monos[i];
				_Monos[i] = _Monos[i + 1];
				_Monos[i + 1] = m;
			}

		}
	}
}
//streamout operator << in order to print the polynom uses (getStringRepresentation) method
std::ostream & operator<<(std::ostream & out, const Polynomial & p){
	return out << p.getStringRepresentation();
}
// Global function: + operator between a polynom and an integer
Polynomial operator+(const Polynomial & p, int coeff)
{
	
	Monomial m(coeff);
	Polynomial tmpPoly(p);
	tmpPoly += m;
	return tmpPoly;			 
}
// Global function: + operator between an interger and a polynom ( uses the opposite calling order function) of operator +
Polynomial operator+(int coeff, const Polynomial & p)
{
	return p + coeff;
}
//Global function: + operator between to polynoms, uses the apropriate += method
Polynomial operator+(const Polynomial & p1, const Polynomial & p2)
{
	return Polynomial(p1) += p2;
}

//Global gunction: +operator Monomial to polynom, uses the apropriate =+ method
Polynomial operator+(const Polynomial & p, const Monomial & m)
{
	return Polynomial(p)+=m;
}
// Global gunction : +operator polynom to monomial , uses the opposite calling order function of operator +
Polynomial operator+(const Monomial & m, const Polynomial & p)
{
	return p + m;
}



// Global function: - operator between a polynom and an integer
Polynomial operator-(const Polynomial & p, int coeff)
{

	Monomial m(coeff);
	Polynomial tmpPoly(p);
	tmpPoly -= m;
	return tmpPoly;
}
// Global function: - operator between an interger and a polynom ( uses the opposite calling order function) of operator -
Polynomial operator-(int coeff, const Polynomial & p)
{
/*	Monomial m(coeff);
	Polynomial tmpPoly(p);
	for (int i = 0; i < p._size; i++)
		p._Monos[i].negate();
	tmpPoly += m; */
	return Monomial(coeff)-p;
}
//Global function: - operator between to polynoms, uses the apropriate -= method
Polynomial operator-(const Polynomial & p1, const Polynomial & p2)
{
	return Polynomial(p1) -= p2;
}

//Global gunction: - operator Monomial to polynom, uses the apropriate -= method
Polynomial operator-(const Polynomial & p, const Monomial & m)
{
	return Polynomial(p) -= m;
}
// Global gunction : - operator polynom to monomial , uses the opposite calling order function of operator -
Polynomial operator-(const Monomial & m, const Polynomial & p)
{
	Polynomial tmpPoly(p);
	for (int i = 0; i < p._size; i++)
		tmpPoly._Monos[i].negate();
	tmpPoly += m;
	return tmpPoly;
}
// Global function: * operator between a polynom and  an interger
Polynomial operator*(const Polynomial & p, int coeff)
{
	return Polynomial(p)*=Monomial(coeff);
}
// Global function: * operator between a polynom and  an interger uses the opposite calling order function of operator *
Polynomial operator*(int coeff, const Polynomial & p)
{
	return p * coeff;
}
// Global function : *operator between a polynom and a polynom
Polynomial operator*(const Polynomial & p1, const Polynomial & p2)
{
	return Polynomial(p1)*=p2;
}
// Global function : *operator between a polynom and a Monom
Polynomial operator*(const Polynomial & p, const Monomial & m)
{
	return Polynomial(p)*=m;
}

Polynomial operator*(const Monomial & m, const Polynomial & p)
{
	return p*m;
}

