# fazer um elemento que existe no css aparecer 

function novoElemento(tagname, className){
    const elem = document.createElement(tagname)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreiras')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')

    this.elemento.appendChild(reversa? corpo : borda)
    this.elemento.appendChild(reversa? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px` 
}

const b = new Barreira(true)

b.setAltura(300)
document.querySelector('[wm-flappy]').appendChild(b.elemento)

