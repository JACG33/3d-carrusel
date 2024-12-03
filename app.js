document.addEventListener("DOMContentLoaded", () => {
	/**
	 * @param {String} selector selector html
	 */
	const $doc = (selector) => document.querySelector(selector)


	let actualSrc = $doc("#preview")?.src

	let wheelDegre = 18

	document.addEventListener("click", e => {
		const { target } = e

		if (target.dataset.img == "img") {

			if (actualSrc != target.src) {
				actualSrc = target.dataset.src
				document.querySelectorAll("img").forEach((ele, index) => {
					if (ele.src == target.src) {
						wheelDegre = Number(index) * 18
						$doc("#slider_wrapper").style.transform = `perspective(1500px) rotateX(${wheelDegre}deg)`
					}
				})
				if (document.startViewTransition) {
					document.startViewTransition(() => {
						$doc("#preview").src = target.src
					})
				} else {
					$doc("#preview").src = target.src
				}
			}
		}
	})

	document.addEventListener("wheel", e => {
		const { target } = e
		if (target.closest(".banner")) {
			if (e.deltaY < 0) wheelDegre -= 18
			else wheelDegre += 18
			
			$doc("#slider_wrapper").style.transform = `perspective(1500px) rotateX(${wheelDegre}deg)`
		}
	})

	document.addEventListener("touchend", e => {
		const { target } = e

		if (target.closest(".banner")) {
			const height = target.closest(".banner").clientHeight / 2
			const touchend = e.changedTouches[0].clientY

			if (touchend > height) wheelDegre -= 18
			else wheelDegre += 18
		
			$doc("#slider_wrapper").style.transform = `perspective(1500px) rotateX(${wheelDegre}deg)`
		}
	})

})
