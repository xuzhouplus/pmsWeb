class Effect {
	/**
	 * 类型标识，需全局唯一
	 * @type {null}
	 */
	type = null
	/**
	 * webgl片段着色器
	 * @type {null}
	 */
	fragment = null

	/**
	 * 切换动画持续时长，单位s
	 * @type {number}
	 */
	duration = 1

	/**
	 * 图片切换动画
	 * @param tweenMax
	 * @param reverse
	 * @param completed
	 */
	switchImage(tweenMax, reverse, completed) {
	}

	/**
	 * 文字切换动画
	 * @param caption
	 * @param reverse
	 * @param halfway
	 * @param completed
	 */
	switchCaption(caption, reverse, halfway, completed) {
	}

	/**
	 * 隐藏文字动画
	 * @param caption
	 * @param reverse
	 * @param completed
	 */
	hideCaption(caption,reverse,completed){

	}

	/**
	 * 显示文字动画
	 * @param caption
	 * @param reverse
	 * @param completed
	 */
	showCaption(caption,reverse,completed){}
}

export default Effect;
