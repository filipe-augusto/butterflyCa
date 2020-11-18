//cria um novo elemento
function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}
//define a barreira
function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

/* const b = new Barreira(true)
b.setAltura(300)
document.querySelector('[wm-flappy]').appendChild(b.elemento) */

//cria as barreiras em pares e coloca um tamanho aleatorio
function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    this.getX = () => parseInt(this.elemento.style.left.split('pt')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

/*   const b = new ParDeBarreiras(500, 200, 400)
  document.querySelector('[wm-flappy]').appendChild(b.elemento)
*/

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3),
    ]
    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)
            //quando o elemento sair da area do jogo

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)//coloca no final apartir do valores do espaco e tamanho da barreiras
                par.sortearAbertura() //quando no final sorteia ela para ter uma abertura diferente
            }
            const meio = largura / 2
            const cruzou0Meio = par.getX() + deslocamento >= meio && par.getX() < meio //crouzou o meio
            if (cruzou0Meio) notificarPonto()
        })
    }
}

 function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])//saber qual posicao o passaro ta
    this.setY = y => this.elemento.style.bottom = `${y}px`

    this.elemento.src = 'imgs/ca.gif'

    window.onkeydown = e => voando = true //clicar qlq tecla ele voa
    window.onkeyup = e => voando = false // quando soltar a tecla ele cai

    this.animar = () => {
        const novoY = this.getY() + (voando ? 7 : -5) //ajustando voo 
        const alturaMaxima = alturaJogo - this.elemento.clientWidth

        if(novoY <= 0){
            this.setY(0) //no maximo no chao
        }else if(novoY >= alturaMaxima){
            this.setY(alturaMaxima) //no maximo de cima
        }else{
            this.setY(novoY) //nem o minimo nem o maximo
        }
    }
    this.setY(alturaJogo /2)
} 

function Progresso(){
    this.elemento = novoElemento('span','progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function estaoSobrePostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width - 20 >= b.left && b.left + b.width  - 20 >= a.left
    const vertical = a.top + a.height -20 >= b.top
    && b.top + b.height -20 >= a.top
    return horizontal && vertical
}
function colidiu(passaro, barreiras){
    let colidiu = false
    barreiras.pares.forEach(ParDeBarreiras =>{
        if(!colidiu){
            const superior = ParDeBarreiras.superior.elemento
            const inferior = ParDeBarreiras.inferior.elemento
            colidiu = estaoSobrePostos(passaro.elemento, superior) //se o passaro colidiu com a barreiras superior
            || estaoSobrePostos(passaro.elemento, inferior)//se o passaro colidiu com a barreiras inferior
        }
    })
    return colidiu
}

function FlappyBird(){
    let pontos = 0 
    
    const areaDoJogo = document.querySelector('[wm-flappy]')  //a area do jogo
    const altura = areaDoJogo.clientHeight //altura da area do jogo
    const largura = areaDoJogo.clientWidth //largura

    const progresso = new Progresso() //
    const barreiras = new Barreiras(altura, largura, 250, 400, () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        const temporizador = setInterval(()=>{
            barreiras.animar()
            passaro.animar()

            if(colidiu(passaro, barreiras)){
                clearInterval(temporizador)
                alert('perdeu!')
               
                location.reload(true)
               
            }
        },20)
    }
}
new FlappyBird().start()


//

/* const barreiras = new Barreiras(500, 1200, 200, 400)
const passaro = new Passaro(700)
const areaDoJogo = document.querySelector('[wm-flappy]')
areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

setInterval(() => {
    barreiras.animar()
   passaro.animar()
}, 20) */

