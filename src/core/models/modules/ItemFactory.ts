

export interface ItemFactory<D> {
    create(itemType: string): D;
}

export const itemFactoryProxyHandler = {
    get: function<D>(target: ItemFactory<D>, prop, receiver) {
		var propValue = target[prop];
        if (typeof propValue != "function") {
			return target.create(prop);
		}
		else{
			return function(){
				//"this" points to the proxy, is like using the "receiver" that the proxy has captured
				return propValue.apply(target, arguments);
			}
		}
    }
};