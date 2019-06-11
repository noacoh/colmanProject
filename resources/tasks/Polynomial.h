#pragma once

#include <iostream>
#include "Monomial.h"

class Polynomial
{
private:
	Monomial *_arr;
	int _size;
public:
	Polynomial() :_arr (NULL), _size(0) {};
	Polynomial(const Polynomial& p);
	~Polynomial() { delete[] _arr; }
    
    friend std::ostream& operator << (std::ostream& out, const Polynomial& p);
    
    Polynomial& operator >> (const char* str);

	//operators - Polynomial
	const Polynomial& operator=(const Polynomial& p);
	const Polynomial& operator+=(const Polynomial &p);
	const Polynomial& operator-=(const Polynomial& p);
	const Polynomial& operator*=(const Polynomial& p);
	
//	const Polynomial& operator+(const Monomial& m) const;
	const Polynomial& operator+=(const Monomial &m);
	const Polynomial& operator-=(const Monomial &m);
	const Polynomial& operator*=(const Monomial &m);
	
	int operator[](int exp) const;
	int maxExp() const;
	void sort();
	char* getStringRepresentation() const;
	void addMon(const Monomial & m);
	void deleteZero();
	int FirstEmpty();

	int countMonoms(const char* p);

	friend Polynomial operator*(const Polynomial &p1, const Polynomial &p2);
	friend Polynomial operator+(const Polynomial &p1, const Polynomial &p2);
	friend Polynomial operator-(const Polynomial &p1, const Polynomial &p2);

	friend Polynomial operator*(const Polynomial &p1, const Monomial &m);
	friend Polynomial operator*(const Monomial &m, const Polynomial &p1);

	friend Polynomial operator+(const Polynomial &p1, const Monomial &m);
	friend Polynomial operator+(const Monomial &m, const Polynomial &p1);

	friend Polynomial operator-(const Polynomial &p1, const Monomial &m);
	friend Polynomial operator-(const Monomial &m, const Polynomial &p1);
};


void myRealloc(Polynomial *& oldPoly, int oldSize, int newSize);
void myErase(Polynomial *& oldPoly, int polySize, int indexToErase);
std::ostream& operator << (std::ostream& out, const Polynomial& p);

Polynomial operator*(const Polynomial &p1, const Polynomial &p2);
Polynomial operator+(const Polynomial &p1, const Polynomial &p2);
Polynomial operator-(const Polynomial &p1, const Polynomial &p2);

Polynomial operator*(const Polynomial &p1, const Monomial &m);
Polynomial operator*(const Monomial &m, const Polynomial &p1);

Polynomial operator+(const Polynomial &p1, const Monomial &m);
Polynomial operator+(const Monomial &m, const Polynomial &p1);

Polynomial operator-(const Polynomial &p1, const Monomial &m);
Polynomial operator-(const Monomial &m, const Polynomial &p1);

