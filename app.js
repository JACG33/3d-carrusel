class ThreeDCarrousel {

	#idWrapper = ""
	#wheelDegre = 0
	#stepWheelDegre = 0
	#actualSrc
	#scale

	constructor(idWrapper, url, scale = 0.8) {
		this.#idWrapper = idWrapper
		this.#actualSrc = url
		this.#scale = scale

		this.#makeCarrusel()
		this.#listeners()
	}


	#makeCarrusel() {

		const clone = this.#$doc(`#${this.#idWrapper}`).cloneNode(true)
		const childes = Array.from(clone.childNodes)

		// Slider wrapper
		const slider = document.createElement("div")
		slider.className = "slider"
		slider.id = "slider_wrapper"

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
			item.className = "item"
			item.style.setProperty("--position", index + 1)
		
			// Img
			const img = document.createElement("img")
			img.dataset.img = "img"
			img.loading = "lazy"
			img.className = "img__pers"
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
		this.#$doc(`#${this.#idWrapper}`).className = "banner"
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

	#listeners() {
		document.addEventListener("click", e => {
			const { target } = e

			if (target.dataset.img == "img") {

				if (this.#actualSrc != target.src) {
					this.#actualSrc = target.dataset.src
					document.querySelectorAll("img").forEach((ele, index) => {
						if (ele.src == target.src) {
							this.#wheelDegre = Number(index) * this.#stepWheelDegre
							this.#$doc("#slider_wrapper").style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`
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
			if (target.closest(".banner")) {
				this.#wheelDegre += e.deltaY < 0 ? -this.#stepWheelDegre : this.#stepWheelDegre;
			
				this.#$doc("#slider_wrapper").style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`
			}
		})

		document.addEventListener("touchend", e => {
			const { target } = e

			if (target.closest(".banner")) {
				const height = target.closest(".banner").clientHeight / 2
				const touchend = e.changedTouches[0].clientY

				this.#wheelDegre += touchend > height ? -this.#stepWheelDegre : this.#stepWheelDegre;
		
				this.#$doc("#slider_wrapper").style.transform = `perspective(1500px) rotateX(${this.#wheelDegre}deg)`
			}
		})
	}

}

const dds = new ThreeDCarrousel("wrapper", "img/photo-1.avif", 0.65)