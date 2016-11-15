var itemPage;

itemPage = function(itemId) {
	PageObject.call(this); // call super constructor.

    this.data.id = 'itemPage';
    this.data.url = constants.URL_MAP.item_page + itemId;
    this.data.urlPattern = new RegExp(common.getLinkReg(constants.URL_MAP.item_page)+'.*'+itemId);
    this.data.itemId = itemId;

    this.selector = {
    	itemPage: 'body.itemPage',
    	btnBuyNow: '#btn-buy-now',
        btnAddFavoriteStore: 'a.favor-store',
        sign4FavoriteStoreAdd: '.favor-store.on',
        autoBid: '.label-proxy',
        directBid: '.label-direct',
        bidPrice: 'input[name="bidPrice"]',
        btnGoBid: '.mod-proxy input.button-bid',
        bidPreview: '.item-bidding-wrap .preview-form',
        btnBidConfirm: '.item-bidding-wrap .preview-form input.button-bid',
        highestSet: '.item-bidding-wrap .form-view-wrap .highest-form',
        itemtitle: '.item-title .title',
        itemBrief: '.item-title .subtitle',
        itemprice: '.item-sale-price .number',
        itemSpec: '#module-bidinfo .item-spec-wrap',
        specUnit: '.spec',
        itemQuantityInput: '#item-quantity-input',
        shoppingCartDropDown: '.shopping-cart-drop-down>div',
        btnAddToCart: '#btn-add-cart',
        naviQna: '.item-details .mod-qna a',
        naviInfo: '.item-details .mod-info a',
        QnaLoading: 'section.mod-qna div.loading',
        textareaQna: '.item-qna-ask textarea',
        captchaWrap: '.captchwrap',
        captcha:'#captchaV5Answer',
        captchaImg: '#captchaV5ContentBox #captchaV5ClassicCaptchaImg',
        btnQnaSubmit: '.item-qna-ask input[type=submit]',
        qnaArticle: '.item-qna-commets article',
        // btnAddWatchList: 'button.track-item:not([data-url=""])',
        // btnAddWatchList: 'a.likeIt:not([data-url=""])',
        btnAddWatchList: 'a.likeIt',
        // sign4WatchListAdd: '.item-gallery .track-item.active',
        sign4WatchListAdd: '.item-gallery .likeIt.act',
        mainimage: 'img.main-image',
        zoomView: '.zoom-view img',
        itemnavigation: '#item-details',
        'navigation-iteminfo': '#item-details.mod-info~.mod-info',
        itemdescription: 'section.mod-info .wrap',
        'navigation-iteminfo-images': 'section.mod-info .item-images img',
        imglist: '.item-img-list',
        bidmodule: '.form-view-wrap',
        itemDescBidding: '.mod-info .iframe-tmp iframe',
        videosection: '#itemVideo video,#itemVideo iframe',
        videoWrap: '#itemVideo',
        header: '#hd',
        btnBidMax: '.mod-proxy .button-buynow-wrap input.buynow',
        btnBidMaxConfirm: '.item-bidding-wrap .preview-form input.button-main',
        shoppingCart: '.cart-list',
        'mark-bargain': 'mark.ico-bargain',
        hashtag: '.hashtags',
        payType: '.item-payment .value .h-list>li:not(.prompt-item)',
        lightbox: '.lightbox',
        signLightboxActive: '.lightbox.act',
        btnLightboxClose: '.lightbox.act .close',
        signImageReady: '.item-images img[src]'
    };

    //testData key
    this.requestKey = {
        itemtitle: 'itemTitle',
        itemprice: 'salePrice',
        itemdescription: 'itemDesc',
        biddingitemdescription: 'itemDesc'
    }
};
itemPage.prototype = Object.create(PageObject.prototype);

itemPage.prototype.go = function() {
    var stand = this, pattern = this.data.urlPattern;
    return browser.getCurrentUrl().then(
        function(url) {
            if (!browser.params.forceRefresh && pattern.test(url)) return;
            browser.get(stand.data.url).then(
                function() {
                    // stand.waitUntilPresent('btnAddFavoriteStore');
                    // stand.waitUntilPresent('a.likeIt:not([data-url=""])');
                    browser.wait(
                        function() {
                            return browser.executeScript(
                                function() {
                                    return (arguments[0].id.length) ? true : false;
                                }
                            , stand.one('btnAddWatchList').getWebElement());
                        }
                    , 3000);
                }
            );
        }
    ).thenCatch(
        function(err) {
            //err catch
        }
    ).then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.buyItemDirectly = function() {
	var stand = this, shoppingCart = require(__base + constants.PO.shoppingCart);

	return this.one('btnBuyNow').click().then(
		function() {
			stand.waitUntilNotPresent('itemPage');
		}
	).then(
		function() {
			return new shoppingCart();
		}
	);
};

itemPage.prototype.pickBidType = function(type) {
    var stand = this, bidType = ((['auto', 'direct'].indexOf(type) == -1) ? 'auto' : type) + 'Bid';
    return this.one(bidType).click().then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.bidAs = function(price) {
    var stand = this, price = (parseInt(price, 10) != price) ? 10 : price;

    return this.one('bidPrice').clear().sendKeys(price).then(
        function() {
            stand.one('btnGoBid').click().then(
                function() {
                    stand.waitUntilPresent('bidPreview');
                }
            );
        }
    ).then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.goBid = function(price) {
    var stand = this, price = (parseInt(price, 10) != price) ? 10 : price;

    return this.one('bidPrice').clear().sendKeys(price).then(
        function() {
            stand.one('btnGoBid').click().then(
                function() {
                    stand.waitUntilPresent('bidPreview');
                }
            );
        }
    ).then(
        function() {
            stand.one('btnBidConfirm').click().then(
                function() {
                    stand.waitUntilPresent('highestSet');
                }
            );
        }
    ).then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.goBidMax = function(price) {
    var stand = this, shoppingCart = require(__base + constants.PO.shoppingCart);;

    return this.one('btnBidMax').click().then(
        function() {
            stand.waitUntilPresent('bidPreview');
        }
    ).then(
        function() {
            return stand.clickAndWaitUntilRedirect('btnBidMaxConfirm').then(
                function() {
                    return new shoppingCart();
                }
            );
        }
    ).then(
        function(shoppingCart) {
            return shoppingCart;
        }
    );
};


itemPage.prototype.pickSpec = function(set, spec) {
    var stand = this, itemSpec;
    itemSpec = this.all('itemSpec').get(set);
    return itemSpec.isPresent().then(
        function() {
            if (typeof spec == 'undefined') {
                itemSpec.$(stand.selector.specUnit).click().then(
                    function() {
                        browser.sleep(500);
                    },
                    function(err) {
                        //err catch
                    }
                );
            } else {
                itemSpec.$$(stand.selector.specUnit).each(
                    function(unit) {
                        unit.$('input').getAttribute('data-name').then(
                            function(value) {
                                if (value == spec) {
                                    unit.click().then(
                                        function() {
                                            browser.sleep(500);
                                        },
                                        function(err) {
                                            //err catch
                                        }
                                    );
                                }//end if
                            }
                        );
                    }
                );
            }//end if
        },
        function() {
            //error catch
        }
    ).then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.pickSpecFromFirstSet = function(spec) {
    return this.pickSpec(0, spec);
};

itemPage.prototype.pickSpecFromSecondSet = function(spec) {
    return this.pickSpec(1, spec);
};

itemPage.prototype.selectItemAmount = function(amount) {
    var stand = this, amount = (parseInt(amount, 10) != amount) ? 10 : amount;

    return this.one('itemQuantityInput').clear().sendKeys(amount).then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.goAddToCart = function() {
    var stand = this;
    
    return this.one('btnAddToCart').click().then(
        function() {
            stand.waitUntilDisplay('shoppingCartDropDown');
        }
    ).then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.pickNavigationAs = function(type) {
    var stand = this;
    if (['info', 'qna'].indexOf(type) == -1) type = 'info';

    type = 'navi' + common.capitalize(type);
    
    return this.rollTo(type).then(
        function() {
            stand.one(type).click().then(
                function() {
                    stand.waitUntilNotPresent('QnaLoading');
                }
            );
        }
    ).then(
        function() {
            return stand;
        },
        function(err) {
            return stand;
        }
    );
};

itemPage.prototype.fillQuiz = function(content) {
    var stand = this;
    return this.one('textareaQna').clear().sendKeys(content).then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.fillCaptcha = function() {
    var stand = this;
    return this.one('captcha').isPresent().then(
        function(flag) {
            if (!flag) return;
            //captcha
            stand.one('captchaImg').getAttribute('src').then(
                function(src) {
                    var uri = constants.DE_CAPTCHA_URL, opt;
                    opt = {
                        method: 'get',
                        data: {
                            url : src
                        }
                    };
                    stand.io(uri, opt).then(
                        function(response) {
                            var secWord = response.replace(/\n/g, '').replace(/<secword>(.*)<\/secword>.*/, '$1');
                            stand.one('captcha').clear().sendKeys(secWord);
                        }
                    );
                }
            );
        }
    ).then(
        function() {
            return stand;
        }
    );
};

itemPage.prototype.goQuizSubmit = function() {
    var stand = this;
    return this.all('qnaArticle').count().then(
        function(amount) {
            return stand.one('btnQnaSubmit').click().then(
                function() {
                    return browser.wait(
                        function() {
                            return stand.all('qnaArticle').count().then(
                                function(cAmt) {
                                    return cAmt != amount;
                                }
                            );
                        }
                    , constants.TIMEOUT).then(
                        function() {
                            return true;
                        },
                        function() {
                            return false;
                        }
                    );
                }
            );
        }
    ).then(
        function(flag) {
            return flag;
        }
    );
};

itemPage.prototype.favoriteStoreActs = function(mode) {
    var stand = this, mode = (typeof mode == 'undefined' || ['add', 'remove'].indexOf(mode) == -1) ? 'add' : mode;
    return this.one('sign4FavoriteStoreAdd').isPresent().then(
        function(flag) {
            if ((mode =='add' && !flag) || (mode == 'remove' && flag)) {
                stand.one('btnAddFavoriteStore').click().then(
                    function() {
                        var method = 'waitUntil' + ((mode == 'remove') ? 'Not' : '') + 'Present';
                        stand[method]('sign4FavoriteStoreAdd', 10000);
                    }
                );
            }//end if
        }
    );
};

itemPage.prototype.addFavoriteStoreForce = function() {
    var stand = this;

    return browser.wait(
        function() {
            return browser.executeScript(
                function() {
                    return (arguments[0].id.length) ? true : false;
                }
            , stand.one('btnAddFavoriteStore').getWebElement());
        }
    , 3000).then(
        function() {
            return stand.favoriteStoreActs('remove').then(
                function() {
                    stand.favoriteStoreActs('add');
                }
            );
        }
    );
};

itemPage.prototype.watchListActs = function(mode) {
    var stand = this, mode = (typeof mode == 'undefined' || ['add', 'remove'].indexOf(mode) == -1) ? 'add' : mode;
    return this.one('sign4WatchListAdd').isPresent().then(
        function(flag) {
            if ((mode =='add' && !flag) || (mode == 'remove' && flag)) {
                browser.executeScript(
                    function() {
                        return arguments[0].click();
                    }
                , stand.one('btnAddWatchList').getWebElement()).then(
                    function() {
                        var method = 'waitUntil' + ((mode == 'remove') ? 'Not' : '') + 'Present';
                        stand[method]('sign4WatchListAdd');
                    }
                );
            }//end if
        }
    );
};

itemPage.prototype.addWatchListForce = function() {
    var stand = this;
    return this.watchListActs('remove').then(
        function() {
            stand.watchListActs('add');
        }
    );
};

itemPage.prototype.isMagnifierCorrect = function() {
    var stand = this, flag = false, info;
    return this.one('mainimage').getAttribute('data-lsrc').then(
        function(lsrc) {
            stand.imgLoader(lsrc).then(
                function(flag) {
                    if (!flag) throw new Error('image loader fail');
                }
            );
        }
    ).then(
        function() {
            var e = stand.one('mainimage');
            browser.actions().mouseMove(e).perform().then(
                function() {
                    stand.waitUntilDisplay('zoomView').then(
                        function() {
                            stand.one('zoomView').getAttribute('style').then(
                                function(style) {
                                    info = style;
                                }
                            );
                        }
                    );
                }
            ).then(
                function() {
                    browser.actions().mouseMove({x:50, y:50}).perform().then(
                        function() {
                            stand.waitUntilDisplay('zoomView').then(
                                function() {
                                    stand.one('zoomView').getAttribute('style').then(
                                        function(style) {
                                            flag = info != style;
                                        }
                                    )
                                }
                            );
                        }
                    );
                }
            );
        }
    ).then(
        function() {
            return flag;
        },
        function() {
            return false;
        }
    );
};


itemPage.prototype.isGalleryCarouselCorrect = function(key) {
    var stand = this, flag = false, info;
    return this.one('imglist').getAttribute('style').then(
        function(style) {
            info = style;
        }
    ).then(
        function() {
            stand.pickSpecFromFirstSet(key.trim());
        }
    ).then(
        function() {
            stand.one('imglist').getAttribute('style').then(
                function(style) {
                    flag = info != style;
                }
            );
        }
    ).then(
        function() {
            return flag;
        },
        function(err) {
            return false;
        }
    )
};

itemPage.prototype.getItemDescBidding = function() {
    var result;
    return browser.executeScript(
        function() {
            var iframe = arguments[0];
            return iframe.contentWindow.document.getElementsByTagName('body')[0].innerHTML;
        }
    , this.one('itemDescBidding').getWebElement()).thenCatch(
        function(err) {
            result = '';
        }
    ).then(
        function(value) {
            result = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
        }
    ).then(
        function() {
            return result;
        }
    );
};

itemPage.prototype.isVideoCorrect = function() {
    var stand = this, flag = false;

    return this.rollTo('videoWrap').then(
        function() {
            stand.waitUntilDisplay('videosection').then(
                function() {
                    browser.sleep(3000);
                }
            );
        }
    ).then(
        function() {
            return browser.executeScript(
                function() {
                    var video = arguments[0];
                    return arguments[0].isPlay();
                }
            , stand.one('videosection').getWebElement()).then(
                function(played) {
                    flag = played;
                    // console.log('first:'+flag);
                    // browser.sleep(10000);
                }
            );
        }
    ).then(
        function() {
            stand.rollTo('header');
        }
    ).then(
        function() {
            return browser.executeScript(
                function() {
                    var video = arguments[0];
                    return !arguments[0].isPlay();
                }
            , stand.one('videosection').getWebElement()).then(
                function(paused) {
                    flag = flag && paused;
                    // browser.sleep(10000);
                    // console.log('final:'+flag);
                }
            );
        }
    ).thenCatch(
        function(err) {
            // console.log(err)
            flag = false;
        }
    ).then(
        function() {
            return flag;
        }
    );
};


itemPage.prototype.getTitle = function() {
    var title = '';
    return this.one('itemtitle').getInnerHtml().then(
        function(t) {
            title = t.trim();
        },
        function(err) {
            //error occur
        }
    ).then(
        function() {
            return title;
        }
    );
};

itemPage.prototype.getPrice = function() {
    var price = '';
    return this.one('itemprice').getInnerHtml().then(
        function(p) {
            price = p.replace(/,/g, '').trim();
        },
        function(err) {
            //error occur
        }
    ).then(
        function() {
            return price;
        }
    );
};

itemPage.prototype.getPayType = function() {
    var stand = this, payType, payTypeStr, mapping;
    payType = [];
    payTypeStr = '';
    mapping = {
        'Cash': '現金',
        'CreditCard': '信用卡',
        'Family': '全家',
        '7-11': '7-ELEVEN',
        'UnionPay': '銀聯卡',
        'CashOnDelivery': '郵局'
    };

    return this.all('payType').each(
        function(node) {
            node.getInnerHtml().then(
                function(html) {
                    payTypeStr += html;
                }
            );
        }
    ).then(
        function() {
            Object.keys(mapping).forEach(
                function(key) {
                    var p;
                    p = new RegExp(mapping[key]);
                    if (p.test(payTypeStr)) payType.push(key);
                }
            );
        }
    ).then(
        function() {
            return payType;
        }
    );
};

itemPage.prototype.isPayTypeExist = function(key) {
    var flag;
    return this.getPayType().then(
        function(payType) {
            flag = payType.indexOf(key) != -1;
        }
    ).thenCatch(
        function(err) {
            flag = false;
        }
    ).then(
        function() {
            return  flag;
        }
    ); 
};

itemPage.prototype.originateBargain = function(key) {
    var data, stand = this, bargainData, bargainId;
    return this.getWSSID().then(
        function(d) {
            data = d;
        }
    ).then(
        function() {
            var cfg, deferred, http, postData, req, uri;

            uri = common.parse_url(constants.BARGAIN_ON);
            http = require(uri.scheme);

            postData = {
                listings: [
                    {
                        id: stand.data.itemId,
                        modelId: '',
                        productId: '',
                        quantity: '1'
                    }
                ],
                message: '我要議價',
                price: key
            };
            postData = JSON.stringify(postData);

            cfg = {
                method: 'POST',
                headers: {
                    'Cookie': data.cookie.join(';'),
                    'Content-Type': 'application/json',
                    'X-YahooWSSID-Authorization': data.wssid
                }
            };
            cfg.host = uri.host;
            cfg.path = uri.path;
            if (uri.query) cfg.path += '?' + uri.query;
            if (uri.port) cfg.port = uri.port;

            deferred = protractor.promise.defer();

            req = http.request(cfg, function(response) {
                var resBody = '';
                response.on('data', function(d) {
                    resBody += d;
                });
                response.on('end', function() {
                    // console.log(resBody)
                    bargainData = JSON.parse(resBody);
                    deferred.fulfill(true);
                });
            });

            req.write(postData);
            req.end();

            return deferred.promise;
        }
    ).then(
        function() {
            // if (typeof bargainData.resourceId == 'undefined') throw new Error(bargainData.errors[0].message);
            if (typeof bargainData.errors != 'undefined') throw new Error(bargainData.errors[0].message);
            bargainId = bargainData.resourceId;
        }
    ).thenCatch(
        function(err) {
            // console.log(err);
        }
    ).then(
        function() {
            return bargainId;
        }
    );
};

itemPage.prototype.acceptBargain = function(request) {
    var stand = this, flag = true, data, bargainData;
    return this.getWSSID().then(
        function(d) {
            data = d;
        }
    ).then(
        function() {
            var cfg, deferred, http, postData, req, uri;

            uri = common.parse_url(constants.BARGAIN_ACCEPT);
            http = require(uri.scheme);

            postData = {
                action: 'accept',
                content: '我接受議價',
                price: String(request.price)
            };
            postData = JSON.stringify(postData);

            cfg = {
                method: 'POST',
                headers: {
                    'Cookie': data.cookie.join(';'),
                    'Content-Type': 'application/json',
                    'X-YahooWSSID-Authorization': data.wssid
                }
            };
            cfg.host = uri.host;
            cfg.path = uri.path.replace(/\{1\}/, request.id);
            if (uri.query) cfg.path += '?' + uri.query;
            if (uri.port) cfg.port = uri.port;

            deferred = protractor.promise.defer();

            req = http.request(cfg, function(response) {
                var resBody = '';
                response.on('data', function(d) {
                    resBody += d;
                });
                response.on('end', function() {
                    // console.log(resBody);
                    bargainData = JSON.parse(resBody);
                    deferred.fulfill(true);
                });
            });

            req.write(postData);
            req.end();

            return deferred.promise;
        }
    ).then(
        function() {
            if (typeof bargainData.errors != 'undefined') throw new Error(bargainData.errors[0].message);
        }
    ).thenCatch(
        function(err) {
            // console.log(err);
            flag = false;
        }
    ).then(
        function() {
            return flag;
        }
    );
};

itemPage.prototype.getHashtag = function() {
    var stand = this, htag = [];
    return this.one('hashtag').$$('a').each(
        function(unit, idx) {
            unit.getText().then(
                function(text) {
                    htag.push(text);
                }
            );
        }
    ).thenCatch(
        function(err) {
            // console.log(err);
        }
    ).then(
        function() {
            return htag.map(function(e){return e.trim();}).sort().join(',');
        }
    );
};

itemPage.prototype.isLightboxCorrect = function() {
    var stand = this, flag = true;
    return this.one('lightbox').isPresent().then(
        function(sign) {
            if (!sign) throw new Error('lightbox doesn\'t exist.');
        }
    ).then(
        function() {
            stand.rollTo('navigation-iteminfo-images').then(
                function() {
                    stand.waitUntilPresent('signImageReady').then(
                        function() {
                            browser.sleep(1000);
                            stand.rollTo('navigation-iteminfo-images');
                        }
                    );
                }
            );
        }
    ).then(
        function() {
            stand.one('navigation-iteminfo-images').click().then(
                function() {
                    stand.waitUntilPresent('signLightboxActive');
                }
            );
        }
    ).then(
        function() {
            browser.sleep(300);
            stand.one('btnLightboxClose').click().then(
                function() {
                    stand.waitUntilNotPresent('signLightboxActive');
                }
            );
        }
    ).thenCatch(
        function(err) {
            // console.log(err);
            flag = false;
        }
    ).then(
        function() {
            return flag;
        }
    );
};

module.exports = itemPage;