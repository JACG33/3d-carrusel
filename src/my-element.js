import { LitElement, css, html } from 'lit'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {

  #idWrapper = ""
  #wheelDegre = 0
  #stepWheelDegre = 0
  #actualSrc
  #scale
  #touchstart = 0
  #touchmove = false
  #touchend = 0
  #sliderId = "d3_slider_wrapper"
  #slider



  static get properties() {
    return {
      prop: { type: String }
    }
  }

  constructor() {
    super()

    this.#makeCarrusel()  
    document.addEventListener("DOMContentLoaded", () => {
      this.shadowRoot?.querySelector(`#${this.#sliderId}`).addEventListener("click", e => {
        const { target } = e
        if (target.dataset.img == "img") {
          if (this.#actualSrc != target.src) {
            this.#actualSrc = target.dataset?.src ? target.dataset?.src : target.src
            Array.from(this.shadowRoot?.querySelector("div").querySelectorAll("img")).forEach((ele, index) => {
              if (ele.src == target.src) {
                this.#wheelDegre = Number(index) * this.#stepWheelDegre
                this.shadowRoot.querySelector(`#${this.#sliderId}`).style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`
              }
            })
            // if (document.startViewTransition) {
            //   document.startViewTransition(() => {
            //     this.#$doc("#preview").src = target.src
            //   })
            // } else {
            //   this.#$doc("#preview").src = target.src
            // }
          }
        }
      })


      this.shadowRoot?.querySelector(`#${this.#sliderId}`).addEventListener("wheel", e => {
        const { target } = e

        this.#wheelDegre += e.deltaY < 0 ? -this.#stepWheelDegre : this.#stepWheelDegre;
      
        this.shadowRoot.querySelector(`#${this.#sliderId}`).style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`
      })

      this.shadowRoot?.querySelector(`#${this.#sliderId}`).addEventListener("touchstart", e => {
        const { target } = e
        this.#touchstart = e.changedTouches[0].clientY
      })

      this.shadowRoot?.querySelector(`#${this.#sliderId}`).addEventListener("touchmove", e => {
        const { target } = e
        this.#touchmove = true
      })


      this.shadowRoot?.querySelector(`#${this.#sliderId}`).addEventListener("touchend", e => {
        const { target } = e
        this.#touchend = e.changedTouches[0].clientY

        if (this.#touchmove) {
          const height = target.clientHeight / 2

          this.#wheelDegre += this.#touchend > this.#touchstart ? -this.#stepWheelDegre : this.#stepWheelDegre;
    
          this.shadowRoot.querySelector(`#${this.#sliderId}`).style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`

          // Resetear variables
          this.#touchstart = 0
          this.#touchmove = false
          this.#touchend = 0
        }
        // if (target.closest(".d3__banner")) {
        // }
      })
    })  


  }

  render() {
    return html`
      <slot></slot>
      ${this.#slider}
    `
  }

  static get styles() {
    return css`
      :host{
        width: 100%;
        height: 100dvh;
        text-align: center;
        overflow: hidden;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      :host::after,
      :host::before{
        content: "";
        width: 100%;
        height: 100px;
        left: 0px;
        position: absolute;
        z-index: 10;
        pointer-events: none;
        user-select: none;
      }

      :host::before{
        top: 0px;
        background-image: linear-gradient(180deg, var(--body-dark) 5%, transparent 100%);
      }

      :host::after{
        bottom: 0px;
        background-image: linear-gradient(0deg, var(--body-dark) 5%, transparent 100%);
      }

      .d3__slider{
        position: absolute;
        width: 200px;
        height: 250px;
        transform-style: preserve-3d;
        scale: 0.8;
        transition: 800ms;
        transform: perspective(1500px);
      }

      .d3__item{
        position: absolute;
        inset: 0;
        transform: rotateX(calc((var(--position) - 1) * (360 / var(--quantity)) * -1deg)) translateZ(420px);
        transition: 500ms;
      }

      .d3__img__pers{
        border-radius: 8px;
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
      }

    `
  }

  /**
   * @param {String} selector String del Selector
   * @returns HTMLElement 
   */
  #$doc(selector, all = false) {
    return document.querySelector(selector)
  }

  /**
   * Funcion que crea el carrusel
   */
  #makeCarrusel() {

    const clone = Array.from(document.querySelectorAll("img"))
    // Slider wrapper
    const slider = document.createElement("div")
    slider.className = "d3__slider"
    slider.id = this.#sliderId

    let items = []
    clone.forEach((ele, index) => {
      // Item wrapper
      const item = document.createElement("div")
      item.className = "d3__item"
      item.style.setProperty("--position", index + 1)
    
      // Img
      const img = document.createElement("img")
      img.dataset.img = "img"
      img.loading = "lazy"
      img.className = "d3__img__pers"
      img.src = ele.dataset?.src ? ele.dataset?.src : ele.src

      if (clone.length > 10) {
        item.style.transform = `rotateX(calc((var(--position) - 1) * (360 / var(--quantity)) * -1deg)) translateZ(${42 * clone.length}px)`
      }
    
      item.append(img)
      items.push(item)
    })

    slider.style.scale = this.#scale

    slider.style.setProperty("--quantity", clone.length)

    this.#stepWheelDegre = 360 / clone.length

    // document.innerHTML = null
    document.className = "d3__banner"
    items.forEach(ele => {
      slider.append(ele)
    })
    document.querySelectorAll("img").forEach(ele => { ele.remove() })
    // document.append(slider)
    this.#slider = slider
  }
}

window.customElements.define('my-element', MyElement)
