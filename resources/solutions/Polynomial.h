#pragma once

#include <iostream>
#include "Monomial.h"

class Polynomial
{
private:
	Monomial* _Monos;
	int _size;
public:
	//C'tors & D'tors
	Polynomial() : _size(0), _Monos(NULL) {}
	~Polynomial() { delete[] _Monos; }
	//C'ctor
	Polynomial(const Polynomial& P) {
		_Monos = NULL;
		*this = P; //calling assignmnet operator
	}
	//assignment type operators
	const Polynomial& operator=(const Polynomial& p);
	const Polynomial& operator+=(const Polynomial& p);
	const Polynomial& operator+=(const Monomial & m);
	const Polynomial& operator-=(const Polynomial& p);
	const Polynomial& operator-=(const Monomial & m);
	const Polynomial& operator*=(const Polynomial& p);
	const Polynomial& operator*=(const Monomial & m);
	
	int operator[](int exp) const;
	void addMonom(const Monomial & m);
	void removeCoeffZero();
    Polynomial & operator >> (const char* str);
	int maxExp() const;
	void sort();
	char* getStringRepresentation() const;
	void uniteExp();

	//global functions
	friend std::ostream& operator << (std::ostream& out, const Polynomial& p);
	friend Polynomial operator+(const Polynomial & p, int coeff);
	friend Polynomial operator+(int coeff, const Polynomial & p);
	friend Polynomial operator+(const Polynomial & p1, const Polynomial & p2);
	friend Polynomial operator+(const Polynomial & p, const Monomial & m);
	friend Polynomial operator+(const Monomial & m, const Polynomial & p);

	friend Polynomial operator-(const Polynomial & p, int coeff);
	friend Polynomial operator-(int coeff, const Polynomial & p);
	friend Polynomial operator-(const Polynomial & p1, const Polynomial & p2);
	friend Polynomial operator-(const Polynomial & p, const Monomial & m);
	friend Polynomial operator-(const Monomial & m, const Polynomial & p);

	friend Polynomial operator*(const Polynomial & p, int coeff);
	friend Polynomial operator*(int coeff, const Polynomial & p);
	friend Polynomial operator*(const Polynomial & p1, const Polynomial & p2);
	friend Polynomial operator*(const Polynomial & p, const Monomial & m);
	friend Polynomial operator*(const Monomial & m, const Polynomial & p);


};

std::ostream& operator << (std::ostream& out, const Polynomial& p);
