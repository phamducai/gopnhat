const FlagVi = () => {
  return (
    <img
      height="20"
      width="30"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAKrCAMAAABYyA+mAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAADAFBMVEXaJR3bKxzlZRTlZBXxrAvxqwvbKB387gL87wLkYBX//wDkXxXwpwzwpgzaJx376gP86wPaKB3jWxbjWhbvogzvoQ3aJh375gP76APiVhfiVRfunQ3unA364gT65AThUBfhTxftlw7tlg753QX53wTgSxjgShjskg/skQ/42QX42AXfRRngRhnsjA/rjA/40wb30wbfQBn//gDfQhnrhxDrhhD3zgb3zQfePBr//QDePRrqghHqgRH2yQf2yAfdNhv+/AD//ADdOBrpfBHpexL1wwj1wgjcMxv++gH++wHdNBvodxLodhL0vgn0vQncMBz++AH++QHcMRvnchPncRPzuQnzuAnbLhz99gH+9gHcLhzmbRPmbBTytAryswr98wL99AHbLBzlZxTlZhTxrgvxrQvbKRz88AL98QLbKhzkYhXkYRXwqQvwqAz87ALjXRbjXBbvpAzvowz76QP86gPjVxbiVxbvng3ung364wTiURfhURfumA7tmA753gT63wThTBjhSxjtkw7tkg752gX52QXgRRngRxjsjg/sjQ/41Qb41AbfQRnfQxnriRDriBD30Ab3zwbePhrqhBDqgxD2ywf2ygfdORreOhrpfhHpfRH1xQj1xAjdNRvoeRLoeBL0wAj0vwncMhvcNBvndBPncxPzuwnzugn+9wHmbxPmbhPztQrytQr99QHbLRzlaRTlaBTyrwvxrwv98ALlYxXkYxXxqgvwqgv87QLkXhXkXRXwpQzwpAzjWRbjWBbvoA3vnw375QP75wPiUxfiUhfumg3umQ764QThThjhTRjtlQ7tlA753AXgSRjgSBjskA/sjw/41wX41gXfRBnriw/rihD30gb30QbePxrqhhDqhRD2zQf2zAfdOhreOxrpgBHpfxH1xwj1xgjdNxvpehLoehL1wQj0wQjodRLndRL0vAn0uwncLxzncBPnbxPztwrztgrmahTmaRTysQrysAr98gLiVBfumw352wX2xwf64ATePxnmaxTqgBHysgr///9y7SflAAAAAWJLR0T/pQfyxQAAAAd0SU1FB+EICgId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"
      alt="Tiếng việt"
    />
  )
}
const FlagEn = ({ ...props }) => {
  return (
    <img
      height="20"
      width="30"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOSSURBVHgBxZV5SBRRHMe/M82Sq1ZreZWZV6dWUtiWbn9kRZQVaUSFGauZFpJumAYdpJFaFmSnXQtq2YGwtRQR2UXaSh4ddlCItWtmSqau7nqs1zRvwsV0QVcFvzDw3m/4vc/39+bN71Efyn6HBu7KTvte2SDCAHp4bTuWVH/Gj5jDxtjErYGYdPIIrOcnDZQO0TgLHJUt18RIlyTSTIg0oSjCTZSRGgTXqQOyhyQCTIj2h/plLDioKxc6w1iJF7pWchWInaegJD4Kd+mpSL6Uh4oqLYYrS6EAMqkv9kcu5eFEelUxak6mi+hp55Pg+TYX1hIxiAFJ6kGods/AhYS1cHEa2g4QYFy4BOoXsUjZt5KHEmD5hjCUB4YBFMCof2rhxlVLDDjujyJuUBt9ACtmeiAweieUnfY4JVcNagcIMCpYjPiIpbCfZMXHmktKUX3sDPQFxVxxi2B74xLkZR1g3P1PQxq0AAkx/kYD9rJwkwbsJloC1aahpMK+wJpT6dA9V/0HPHswH1pdG6iL2YVsT/Km1V7GRKK2cjX0eYX82GKWB79A/W1lv1NNzPaWQV0J3QsVPx7r4QILPzFyHn1GIwfsEaV7VcTCDDU+eo7aKzeM8wkBy2EXuR3minpn62UWeKREY5Q0amDG2m+RWQldTTq0fvpqnI+ZMA5Cr9kwW6yZqrt1jyXnouep2HOIHYoY+8UnQNM0tgTMRWyAO6iM62h6mg8rH284ci1U6O3JG9Q1G9De0UWaTj91dnVDU/oNQoUCDYqHEDjawUEWAVHQGv59Q1MrshTvcS2nBLX1zXyMXunngccpqxBXXwjtuq1oefsRLunH4ZZ9gYcSYHL6S7gtO43C91Umd83Q3gnPbTeRiDkQXD3P/fPToYmMx1ff9dDez4XNeCH2hvkiN1OKiM0+fA6Tik+oD06G3nkynNMSYbNpHSiG4YHnsl4jLaMAddpWDKSOzm7Ic94g6+47SDdKEKcIhsXNW9CEx8Laz4dvx07cfZDM9e6oEDFovaqIB84ueMB3Ib2hy1jh4bRng4KaMjBvlxJJthIIc66DEgi4y2EHd0mEgvCcHMaDIUBSIfl+mXeKkUKuxF+NGK56DCiffMHOLZsRKg0BlZXNGyA7wHSwlJYDikYK2Fd/Glpw4nI+5DaWRgOsPFPDOPgeD9M2GrwHtQrN4t+x7t1lWVBs35gpA82cgTwo3R1wZK+s9C8a3N/4FI59uwAAAABJRU5ErkJggg=="
      alt="English"
      {...props}
    />
  )
}
export { FlagEn, FlagVi }
