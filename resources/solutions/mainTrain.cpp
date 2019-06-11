#include <iostream>
#include "Polynomial.h"

static const std::string computationResults[] =
{
    "8x^4+7x^3+5x^2+4x-1",
    "40x^5-21x^4-24x^3-15x^2-33x+7",
    "200x^5-105x^4-120x^3-75x^2-165x+35",
    "200x^5-105x^4-120x^3-75x^2-165x+35",
    "0",
    "400x^5-210x^4-240x^3-150x^2-330x+70",
    "200x^5-105x^4-120x^3-75x^2-165x+42",
    "200x^5-105x^4-120x^3-75x^2-165x+33",
    "-200x^5+105x^4+120x^3+75x^2+165x-44"
};

static bool comparePolynomialResult(const Polynomial& p, unsigned index)
{
    char* s = p.getStringRepresentation();
    std::string str(s);
    delete[] s;
    return str == computationResults[index];
}


using std::cout;
using std::endl;

int main(void)
{
    Polynomial p1, p2;
    unsigned resultIndex = 0;
    
    p1 >> "5x^2-5x+5+7x^3+9x+8x^4-6";
    
    p1.sort();
    
    if (!comparePolynomialResult(p1, resultIndex++))
        cout<<"Error in >> operator"<<endl;
    
    if (p1[4] != 8)
        cout<<"Error in operator []"<<endl;
    if (p1[10] != 0)
        cout<<"Error in operator []"<<endl;

    p2 >> "5x-7";
    
    p1 *= p2;
    
    p1.sort();
    
    if (!comparePolynomialResult(p1, resultIndex++))
        cout<<"Error in *= operator"<<endl;
    
    const Polynomial fiveTimesP1 = 5 * p1;
    
    if (!comparePolynomialResult(fiveTimesP1, resultIndex++))
        cout<<"Error in * (Mon*Pol) operator"<<endl;
    
    const Polynomial p1TimesFive = p1 * 5;
    
    if (!comparePolynomialResult(p1TimesFive, resultIndex++))
        cout<<"Error in * (Pol*Mon) operator"<<endl;

    if (!comparePolynomialResult(fiveTimesP1 - p1TimesFive, resultIndex++))
        cout<<"Error in - (Pol-Pol) operator"<<endl;
    
    Polynomial* p = new Polynomial(p1TimesFive);
    Polynomial* pp = new Polynomial(fiveTimesP1);
    
    {
        Polynomial temp = *p;
        temp = fiveTimesP1 + p1TimesFive;
        if (!comparePolynomialResult(temp, resultIndex++))
            cout<<"Error in + (Pol+Pol) operator\n";
    }
    {
        const Polynomial temp = *p;
        if (temp.maxExp() != 5)
            cout<<"Error in maxExp\n";
        Monomial x1(200, 5); Monomial x2(-105,4);
        Polynomial y = fiveTimesP1 - x1 - x2;
        if (y.maxExp() != 3)
            cout<<"Error in maxExp\n";
    }
    
    *p += 7;
    
    if (!comparePolynomialResult(*p, resultIndex++))
        cout<<"Error in += (Pol+Mon) operator"<<endl;
    
    *pp -= 2;
    
    if (!comparePolynomialResult(*pp, resultIndex++))
        cout<<"Error in -= (Pol-Mon) operator"<<endl;
    
    Polynomial poly = -2 - *p;
    poly.sort();
    
    if (!comparePolynomialResult(poly, resultIndex++))
        cout<<"Error in - (Mon-Pol) operator"<<endl;
    
    delete p;
    delete pp;
    
    cout<<"done\n";
    
    return 0;
}
