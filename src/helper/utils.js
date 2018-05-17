/**
 * 存储localStorage
 */
export const lsSet = (name, val) => {
	if (!name) return;
	if (typeof val !== 'string') {
		val = JSON.stringify(val);
	}
	window.localStorage.setItem(name, val);
}
/**
 * 获取localStorage
 */
export const lsGet = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}
/**
 * 删除localStorage
 */
export const lsRemove = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}