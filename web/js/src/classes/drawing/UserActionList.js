fm.Package("drawing");
fm.Class("UserActionList");
/**
 * create user action list
 * @class
 */
drawing.UserActionList = function (me) {
    this.setMe = function (_me) {
        me = _me;
    };


    /**
     * @param {Array} s
     */
    this.UserActionList = function (s) {
        me.actionList = s || [];
    };

    /**
     * add single user action
     * @param {String} action
     */
    this.addUserAction = function (action) {
        me.actionList.push(action);
    };

    /**
     * remove top item
     * @return {String}
     */
    this.pop = function () {
        return me.actionList.pop();
    };

    /**
     * return top user action
     * @return {String}
     */
    this.getTopLayer = function () {
        return me.actionList[me.actionList.length - 1];
    };

    /**
     * return all user actions
     * @return {Array}
     */
    this.getActions = function () {
        return me.actionList;
    };
};
