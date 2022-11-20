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

/*
              TESTE 
const b = new Barreira(true)
b.setAltura(300)
document.querySelector('[wm-flappy]').appendChild(b.elemento)

*/

function ParDeBarreiras(altura, abertura, x){
    /*chama elemento e atribui novos parametros */
    this.elemento = novoElemento( 'div', 'par-de-barreiras')

    
    this.superior = new Barreira(true)  
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.soartearabertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    this.getx = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura =  () => this.elemento.clientWidth

    this.soartearabertura()
    this.setX(x)
}

// const b = new ParDeBarreiras(700,200,400)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)


function Barreiras(altura, largura, abertura, espaço, notificarPonto){
    this.pares= [
        new ParDeBarreiras(altura, abertura , largura),
        new ParDeBarreiras(altura, abertura, largura + espaço),
        new ParDeBarreiras(altura, abertura, largura + espaço * 2 ),
        new ParDeBarreiras(altura, abertura, largura + espaço * 3 ),
        new ParDeBarreiras(altura, abertura, largura + espaço * 4 )
     ] 

     const deslocamento = 5                      
     this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getx() - deslocamento)

            //loop para retornar quando o elemento sair da tela 
            if(par.getx() < par.getLargura())
            {
                par.setX(par.getx() + espaço * this.pares.length)
                par.soartearabertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getx() + deslocamento >= meio && par.getx() < meio 

            if (cruzouOMeio) notificarPonto() 
            
        })
     }
}



function Passaro(alturaJogo)
{
    let voando = false 
    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = './assets/img/passaro.png'
    

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`
    window.onkeydown  = e => voando = true 
    window.onkeyup = e => voando = false

    this.animar = () => 
    {
        const novoY = this.getY() + (voando ? 8 : -5 )
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if(novoY <= 0)
        {
            this.setY(0)
        }else if(novoY >= alturaMaxima)
        {
            this.setY(alturaMaxima)
        }else{
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

// const barreiras = new Barreiras(700, 1100, 200, 400)
// const passaro  = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')

// areaDoJogo.appendChild(passaro.elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

// setInterval(() => { 
//         barreiras.animar(), 
//         passaro.animar()
//     20}
// )



function Progresso(alturaJogo)
{
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos 
    }
    this.atualizarPontos(0)
}

function posicao(elmA, elmB)
{
    const a = elmA.getBoundingClientRect()
    const b = elmB.getBoundingClientRect()


    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top 

    return horizontal && vertical
}
function impacto(passaro, barreiras)
{
    let colidiu = false

    barreiras.pares.forEach(parDeBarreiras => {
        if(!colidiu)
        {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = posicao(passaro.elemento, superior) || posicao(passaro.elemento, inferior)
        }
    })
    return colidiu
}
function FlyByrd()
{
    let pontos = 0
    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso =  new Progresso
    const barreiras =  new Barreiras(altura, largura, 300 , 400,
        () => progresso.atualizarPontos(++pontos)
    )
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
       // loop 
       const temporizador =  setInterval(() => { 
                barreiras.animar(), 
                passaro.animar()
                if(impacto(passaro, barreiras))
                {
                    clearInterval(temporizador)
                }
        }, 20)
    }
}

new FlyByrd().start()


// outras fases 

//se a pontuação for > 15 deslocamento recebe um valor maior  b 