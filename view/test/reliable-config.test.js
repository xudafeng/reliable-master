'use strict';

import {
  webpackHelper,
} from 'macaca-wd';

const {
  driver,
  BASE_URL,
} = webpackHelper;

describe('test/reliable-config.test.js', () => {
  describe('notification config', () => {
    before(() => {
      return driver
        .initWindow({
          width: 800,
          height: 600,
          deviceScaleFactor: 2,
        });
    });

    afterEach(function () {
      return driver
        .coverage()
        .saveScreenshots(this);
    });

    after(() => {
      return driver
        .openReporter(false)
        .quit();
    });

    it('add config', () => {
      return driver
        .getUrl(`${BASE_URL}/setting`)
        .elementByCss('[data-accessibilityid=add-notification]')
        .click()
        .sleep(500)
        .waitForElementByCss('[data-accessibilityid="dingtalk-webhooks"] .ant-form-item:nth-child(1) input')
        .sendKeys('http://host.local')
        .waitForElementByCss('[data-accessibilityid="dingtalk-webhooks"] .ant-form-item:nth-child(2) input')
        .sendKeys('http://host2.local')
        .elementByCss('[data-accessibilityid="dingtalk-webhooks"] form > .ant-form-item:last-child button')
        .click()
        .waitForElementByCss('.ant-message')
        .hasText('Update webhooks successfully!');
    });
  });
});
