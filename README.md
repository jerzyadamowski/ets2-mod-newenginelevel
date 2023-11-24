## Setup develop environment.

```
npm run update
```

```
npm run package "C:\Users\<Users>\Documents\Euro Truck Simulator 2\mod"
```

MATH for caculate engine level:

FLE (First Level Expected) = 0

LLE (Last Level Expected) = 100

HP (Horse Power) = 360

LHP (Lowest Horse Power for Truck) = 360

HHP (Highest Horse Power for Truck) = 510

M (Muliplier Key Power for HHP) = 4

LTKHP (Lowest Temporary Key Horse Power) = MIN(TKHP)

HTKHP (Higest Temporary Key Horse Power) = MAX(TKHP)

TKHP (Temporary Key Horse Power) = ROUND(HP + LHP + HHP x M)+ MAX(HP - LHP, 0) x 2

NL (New Level) = ROUND(((TKHP - LTKHP)/(HTKHP - LTKHP)) x (LLE - FLE)) + FLE
