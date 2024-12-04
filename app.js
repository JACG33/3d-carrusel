class ThreeDCarrousel {

	#idWrapper = ""
	#wheelDegre = 0
	#stepWheelDegre = 0
	#actualSrc
	#scale
	#touchstart = 0
	#touchmove = false
	#touchend = 0
	#sliderId = "d3_slider_wrapper"

	/**
	 * @parman {Object} opc Objeto de opciones.
	 * @parman {String} opc.idWrapper Nombre del contenedor de la images.
	 * @parman {String} opc.url Url de la primera imagen.
	 * @parman {String} opc.scale Escala del carrusel por defecto es 0.8.
	 */
	constructor({ idWrapper = "", url = "", scale = 0.8 }) {
		this.#idWrapper = idWrapper
		this.#actualSrc = url
		this.#scale = scale

		this.#makeCarrusel()
		this.#listeners()
	}


	/**
	 * Funcion que crea el carrusel
	 */
	#makeCarrusel() {

		const clone = this.#$doc(`#${this.#idWrapper}`).cloneNode(true)
		const childes = Array.from(clone.childNodes)

		// Slider wrapper
		const slider = document.createElement("div")
		slider.className = "d3__slider"
		slider.id = this.#sliderId

		// List items
		let items = []
		let cleanChildes = []
		childes.forEach((ele, index) => {
			if (ele.nodeName == "IMG") {	
				cleanChildes.push(ele)
			}
		})


		cleanChildes.forEach((ele, index) => {
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

			if (cleanChildes.length > 10) {
				item.style.transform = `rotateX(calc((var(--position) - 1) * (360 / var(--quantity)) * -1deg)) translateZ(${42 * cleanChildes.length}px)`
			}
		
			item.append(img)
			items.push(item)
		})

		slider.style.scale = this.#scale

		slider.style.setProperty("--quantity", cleanChildes.length)

		this.#stepWheelDegre = 360 / cleanChildes.length

		this.#$doc(`#${this.#idWrapper}`).innerHTML = null
		this.#$doc(`#${this.#idWrapper}`).className = "d3__banner"
		items.forEach(ele => {
			slider.append(ele)
		})
		this.#$doc(`#${this.#idWrapper}`).append(slider)
	}


	/**
	 * @param {String} selector String del Selector
	 * @returns HTMLElement 
	 */
	#$doc(selector) {
		return document.querySelector(selector)
	}

	/**
	 * Funcion que añade los eventListeners para las funciones del carrusel
	 */
	#listeners() {
		document.addEventListener("click", e => {
			const { target } = e

			if (target.dataset.img == "img") {
				if (this.#actualSrc != target.src) {
					this.#actualSrc = target.dataset?.src ? target.dataset?.src : target.src
					document.querySelectorAll("img").forEach((ele, index) => {
						if (ele.src == target.src) {
							this.#wheelDegre = Number(index) * this.#stepWheelDegre
							this.#$doc(`#${this.#sliderId}`).style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`
						}
					})
					if (document.startViewTransition) {
						document.startViewTransition(() => {
							this.#$doc("#preview").src = target.src
						})
					} else {
						this.#$doc("#preview").src = target.src
					}
				}
			}
		})

		document.addEventListener("wheel", e => {
			const { target } = e
			if (target.closest(".d3__banner")) {
				this.#wheelDegre += e.deltaY < 0 ? -this.#stepWheelDegre : this.#stepWheelDegre;
			
				this.#$doc(`#${this.#sliderId}`).style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`
			}
		})

		document.addEventListener("touchstart", e => {
			const { target } = e
			if (target.closest(".d3__banner")) {
				this.#touchstart = e.changedTouches[0].clientY
			}
		})

		document.addEventListener("touchmove", e => {
			const { target } = e
			if (target.closest(".d3__banner")) {
				this.#touchmove = true
			}
		})


		document.addEventListener("touchend", e => {
			const { target } = e
			if (target.closest(".d3__banner")) {
				this.#touchend = e.changedTouches[0].clientY

				if (this.#touchmove) {
					const height = target.closest(".d3__banner").clientHeight / 2

					this.#wheelDegre += this.#touchend > this.#touchstart ? -this.#stepWheelDegre : this.#stepWheelDegre;
		
					this.#$doc(`#${this.#sliderId}`).style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`

					// Resetear variables
					this.#touchstart=0
					this.#touchmove = false
					this.#touchend=0
				}
			}
		})


	}

}

const dds = new ThreeDCarrousel({ idWrapper: "wrapper", scale: 0.65, url: "img/photo-1.avif" })
