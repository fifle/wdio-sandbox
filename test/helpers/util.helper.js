import Page from '../pageobjects/page';

class Util extends Page {
    /**
     * Waits for loading overlay to appear and disappear on the screen.
     * @param null $timeout
     * @throws Exception
     */
    async waitForLoading(timeout) {
        if (!timeout) {
            timeout = 20;
        }

        try {
            $('.loading-overlay').waitForNotDisplayed(timeout);
        } catch (error) {
            console.log('There is no loading overlay on the screen');
        }
    }

    /**
     * Sometimes you need to be able to click on the root element of a page in order to deactivate an element
     * - an input box, a button's hover-state, and so on. Unfortunately some standard Codeception functions
     * don't allow to do that, and tests are so fast that they don't have time to observe the result
     * of a click on another element and become more flaky (one example: the button
     * in Dashboard -> New item is not deactivated until a number greater than 0 is entered in the
     * Qty field, but the field content check is performed only after the text field is taken out
     * of the active state).
     *
     * In order to protect your tests from such situations, you can use this harmless method that
     * fictitiously clicks on the main root tag of the HTML file, <html>. This action has no payload,
     * except that our cursor goes nowhere, but it takes action allowing no element to remain active
     * on the page even if we can't see it with our eyes.
     *
     * If it still doesn't make sense to you, just try using the method. You will like it :)
     *
     * Reference:
     * https://stackoverflow.com/questions/27966080/how-to-simulate-mouse-click-on-blank-area-in-website-by-selenium-ide
     *
     * @throws Exception
     */
    async clickOutside() {
        try {
            await $('//html').click();
            console.log('Ta-da, the fictitious html-tag clicked! {ᵔᴥᵔ}');
        } catch (error) {
            console.log('It seems that HTML file was not loaded. Please check your test logs.');
        }
    }

    async getCurrentURL() {
        const curUrl = await browser.execute('return location.href;');
        return curUrl;
    }

    /**
     * Get value from URL parameter of current URL
     */
    async getURLParam(param) {
        // Grab the query string
        const queryString = await browser.execute('return location.search;');
        console.log(queryString);
        // Retrieve the value
        const urlParams = new URLSearchParams(queryString);
        const getParamValue = urlParams.get(param);
        console.log(getParamValue);
    }

    /** 
     * Waits up to $timeout seconds for the given string to appear on the page.
     * It's a replica of method from Codeception.
     * 
     * @param {*} text Text to be found on the page (needle).
     * @param {*} ms Set waiting time (in milliseconds)
     * @param {*} position Selects the n-th occurrence of the text element.
     */
    async waitForText(text, ms, position) {
        if (!position) {
            position = 1;
        }

        if (!ms) {
            ms = 10000;
        }

        await $("(//*[contains(text(),'" + text + "') and not(name()='script')])[" + position + "]")
            .waitForDisplayed({timeout: ms, timeoutMsg: "Text '" + text + "' wasn't found on the page."});
    }

    async waitForTextNotVisible(text, ms, position) {
        if (!position) {
            position = 1;
        }

        if (!ms) {
            ms = 10000;
        }

        await $("(//*[contains(text(),'" + text + "') and not(name()='script')])[" + position + "]")
            .waitForDisplayed({timeout: ms, reverse: true, timeoutMsg: "Text '" + text + "' wasn't found on the page."});
    }

    /**
     * Searches for the text on the page and clicks it.
     * NB! It's stongly recommended to use locators instead of this method. 
     * This method could be required only in cases, where it's impossible to retrieve locator for the element.
     * The best practise is to ask your devs to add 'data-test' tag for the element.
     * 
     * @param {*} text Text to be found on the page (needle).
     * @param {*} position Selects the n-th occurrence of the text element. 
     * 
     * @example clickByText('Needle in a haystack', '2')
     */
    async clickByText(text, position) {
        if (!position) {
            position = 1;
        }

        await $("(//*[contains(text(),'" + text + "') and not(name()='script')])[" + position + "]")
            .click();
    }
    /**
     * Waits up to $ms miliseconds for the page to load.
     * @param {*} ms Set waiting time (in milliseconds)
     */

    async waitForLoad(ms) {
        if (!ms){
            ms=60000;
        }
        await browser.waitUntil(
        () => browser.execute(() => document.readyState === 'complete'),
        {
          timeout: ms,
          timeoutMsg: 'Page has not been loaded'
        }
      );
}

    /**
     * Wait for element to exist in DOM and visible then perform Click action
     * @param {*} selector
     * @param {number} timeOutBeforeClick
     * @returns {Promise<void>}
     */
    async waitAndClick(selector, timeOutBeforeClick = 0) {
        await browser.pause(timeOutBeforeClick);
        await $(selector).waitForExist();
        await $(selector).isDisplayed();
        await $(selector).click();
    }

    /**
     * Clear input field value
     * @param selector $
     * @returns {Promise<void>}
     */
    async clearInputValues(selector) {
        await selector.doubleClick();
        await browser.keys("Delete");
        await browser.pause(750);
    }
}

export default new Util()