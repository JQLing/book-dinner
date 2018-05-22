export default {
	/**
	 * 存储localStorage
	 */
	const: lsSet = (name, val) => {
		if (!name) return;
		if (typeof val !== 'string') {
			val = JSON.stringify(val);
		}
		window.localStorage.setItem(name, val);
	},
	/**
	 * 获取localStorage
	 */
	const: lsGet = name => {
		if (!name) return;
		return window.localStorage.getItem(name);
	},
	/**
	 * 删除localStorage
	 */
	const: lsRemove = name => {
		if (!name) return;
		window.localStorage.removeItem(name);
	}
}