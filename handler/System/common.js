


/*
	first char to uppercase
*/

Object.defineProperty(String.prototype, 'fU', {

    get: function() {

		return this.charAt(0).toUpperCase() + this.slice(1)
	}
})



/*
	first char to lowercase
*/

Object.defineProperty(String.prototype, 'fL', {

    get: function() {

		return this.charAt(0).toLowerCase() + this.slice(1)
	}
})
