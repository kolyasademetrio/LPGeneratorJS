jQuery(document).ready(function ($) {

    /* --------------------------------- generate --------------------------------- */
    $(document).on('click', '.generate', function () {

        var html = $('html').clone().find('.hamburger').remove().end().find('.generate').remove().end().html();

        var data = {dom: html};

        $.ajax({
            type: "POST",
            url: "handler.php",
            data: data,
            success: function (msg) {
                alert("Прибыли данные: " + msg);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });
    /* ---------------------------------- generate End ------------------------------ */


    function isEmpty(el) {
        return !$.trim(el.html())
    }

    function hasNoTextNodes(el) {
        var str = el.clone().children().remove().end().text().trim();

        return str.length === 0 ? true : false;
    }

    function hasOneChildIsHamburger(el) {
        return (el.children().length == 1) && (el.children().attr('class') == 'dev__hamburger');
    }

    function hasChildsButHamburger(el) {
        return el.children().length > 1;
    }

    function hasWhiteSpace(s) {
        return s.indexOf(' ') >= 0;
    }

    function showElemInfoOnTop(elem) {
        $('.dev__elemInfo').text('<' + elem.tagName + ' class="' + elem.className + '"></' + elem.tagName + '>');
    }

    function getCurrentElemToEdit_selectedOnViewport($this) {
        return $this.parents('.dev__hamburger').parent();
    }

    function addClassDisabled_to_devSaveChangesBtn($this) {
        $this.parents('.dev__hamburger').find('.dev__saveChanges').addClass('disabled');
    }

    function getElemClassesArray($elem) {
        var classes = ( $elem.jquery ) ? $.trim($elem.attr('class')) : $.trim($elem);

        var classesArray = classes.split(' ');

        return classesArray;
    }

    function getAttributes( $node ) {
        var attrs = {};

        $.each($node[0].attributes, function(index, attribute){
            attrs[attribute.name] = attribute.value;
        });

        return attrs;
    }

    /*function removeBeforeElemForLastTreeElem(){
     $('.dev__treeCol').each(function(index, elem){

     if ( $(elem).children().length < 1 ) {
     $(elem).closest('.dev__elemTree__i').addClass('hasNoChild');
     }
     });
     }*/

    function createDevPanel_withTagsToAdd_list(devPanelClassName) {

        var devPanelClassName = ( devPanelClassName !== undefined ) ? (' ' + devPanelClassName) : '';

        var $dev__panel = $('<div class="dev__panel panel panel-default' + devPanelClassName + '"></div>');

        var $dev__panelInner = $('<div class="dev__panelBody panel-body"></div>').appendTo($dev__panel);

        var classes = 'dev__libraryElem btn btn-default text-uppercase text-center';

        libraryElements.forEach(function (item) {

            $('<div class="' + classes + '" tagname="' + item.tagName + '" text="' + item.text + '">' + item.text + '</div>').appendTo($dev__panelInner);

        });

        return $dev__panel;
    }

    function create_dev__panelAddInner($this, devPanelAddClassName) {

        var devPanelAddClassName = ( devPanelAddClassName !== undefined ) ? (devPanelAddClassName + ' ') : '';

        if ($this.parents('.dev__popup').find('.dev__panelAdd').length) {
            $this.parents('.dev__popup').find('.dev__panelAdd').remove();
        }

        var devPanelAdd = '<div class="' + devPanelAddClassName + 'dev__panelAdd panel panel-primary">' +
                                '<div class="panel-heading text-center dev__">' + 'Настройте <span>' + $this.attr('text') + '</span></div>' +
                                    '<div class="dev__panelAddBody panel-body">' +
                                        '<div class="row">' +
                                            '<div class="dev__panelAddInner">' +
                                                '<div class="dev__panelAddColumn col-sm-6 col-xs-12 first"></div>' +
                                                '<div class="dev__panelAddColumn col-sm-6 col-xs-12 second"></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';

        var $devPanelAdd = $(devPanelAdd)

        return $devPanelAdd;
    }

    function create_dev__elementTree() {
        var elementTree = '<div class="dev__elementTreeWrap panel panel-default">' +
            '<div class="dev__elementTreeInner panel-body">' +
            '<div class="dev__elementTree" id="dev__elementTree"></div>' +
            '</div>' +
            '</div>';

        var $elementTree = $(elementTree);
        return $elementTree;
    }

    function create_treeElemsMenu($this) {

        var treeElemsMenuArray = [
            {
                'text': 'Вставить внутрь',
                'action': 'dev__elemTreeInsertChild',
                'exceptions': ['img'],
            },
            {
                'text': 'Вставить после',
                'action': 'dev__elemTreeInsertAfter',
                'exceptions': ['dev__elemToEdit'],
            },
            {
                'text': 'Вставить перед',
                'action': 'dev__elemTreeInsertBefore',
                'exceptions': ['dev__elemToEdit'],
            },
            {
                'text': 'Удалить',
                'action': 'dev__elemTreeRemoveElem',
                'exceptions': ['dev__elemToEdit'],
            },
            {
                'text': 'Дублировать',
                'action': 'dev__elemTreeCopyElem',
                'exceptions': ['dev__elemToEdit'],
            },
        ];

        if ($this.find('.dev__treeElemMenu').length) {
            $this.find('.dev__treeElemMenu').remove();
        }

        var $dev__treeElemMenu = $('<ul class="dev__treeElemMenu panel panel-primary"></ul>').appendTo($this);

        treeElemsMenuArray.forEach(function (treeElemMenuItem) {

            var exeptionTAGs = treeElemMenuItem.exceptions,
                thisAttrElem = $this.attr('elem'),
                thisAttrTagname = $this.attr('tagname');

            if (($.inArray(thisAttrElem, exeptionTAGs) === -1) && ($.inArray(thisAttrTagname, exeptionTAGs) === -1)) {

                $('<li class="dev__treeElemMenuItem" action="' + treeElemMenuItem.action + '">' + treeElemMenuItem.text + '</li>').appendTo($dev__treeElemMenu);
            }
        });
    }

    function create_devElemTreeItem(dev__elemTreeItem_class, tagName) {
        var dev__elemTreeItem_class = ( dev__elemTreeItem_class !== undefined ) ? (dev__elemTreeItem_class + ' ') : '',
            dev__elemTree_i_class = ( dev__elemTreeItem_class.indexOf('dev__elemToEdit') !== -1 ) ? (' dev__elemToEdit_wrap') : '';

        var $elemTree_item = $('<div class="dev__elemTree__i' + dev__elemTree_i_class + '">' +
                                    '<div elem="' + $.trim(dev__elemTreeItem_class) + '" class="' + dev__elemTreeItem_class + 'dev__elemTree__item btn btn-primary init" tagname="' + tagName + '">' +
                                        '<div class="dev__elemTree__itemTagname">' + tagName + '</div>' +
                                        '<div class="dev__elemTree__itemClasses"></div>' +
                                        '<div class="dev__treeElemMenuHumburger"></div>' +
                                    '</div>' +
                                    '<div class="dev__treeCol"></div>' +
                                '</div>');

        return $elemTree_item;
    }

    function setElemTreeLines() {
        $('.dev__treeCol').each(function (index, elem) {

            if ($(elem).children().length == 0) {
                $(elem).closest('.dev__elemTree__i').addClass('hasNoChild');
            } else {
                $(elem).closest('.dev__elemTree__i').removeClass('hasNoChild');
            }

            if ($(elem).children('.dev__elemTree__i').length == 1) {
                $(elem).closest('.dev__elemTree__i').addClass('hasOnlyOneChild');
            } else {
                $(elem).closest('.dev__elemTree__i').removeClass('hasOnlyOneChild');
            }
        });
    }

    function setTreeElemsWidthes() {
        if ($('.dev__treeCol').length > 0) {
            $('.dev__treeCol').not('.col_0').each(function (index, elem) {
                var parentWidth = $(elem).closest('.dev__elemTree__i').outerWidth(),
                    prevElemWidth = $(elem).prev().outerWidth(),
                    thisElemWidth = parentWidth - prevElemWidth - 2;

                $(elem).css({
                    'width': thisElemWidth + 'px',
                });
            });
        }
    }

    var textEditor;

    function initCodeMirror(elemID = "dev__stylesField") {
        var textEditor = CodeMirror.fromTextArea(document.getElementById(elemID), {
            mode: "css",
            theme: 'material',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            keyMap: 'sublime',
        });

        emmetCodeMirror(textEditor);

        var $elemToEdit = getCurrentElemToEdit_selectedOnViewport($('#' + elemID)),
            $elemToAddAttributesValues;

        if ($elemToEdit.find('.dev__elementTree').length) {
            $elemToAddAttributesValues = $elemToEdit.find('.dev__elementTree').find('.dev__elemTree__item.active');
        } else {
            $elemToAddAttributesValues = $elemToEdit.find('.dev__panelBody ');
        }

        textEditor.on('change', function (cMirror) {

            $elemToAddAttributesValues.attr('elem_styles', cMirror.getValue());

        });

        return textEditor;
    }

    function showNotificationOnTheTopOfWindow(notificationText) {
        $('<div class="dev__notification btn btn-danger"></div>')
            .appendTo(document.body)
            .text(notificationText)
            .position({
                my: "center top",
                at: "center top",
                of: window
            })
            .show({
                effect: "blind"
            })
            .delay(2000)
            .hide('fade', {
                duration: "slow"
            }, function () {
                $(this).remove();
            });

        $(document).tooltip({
            position: {
                my: "center top",
                at: "center bottom+5",
            },
            show: {
                duration: "fast"
            },
            hide: {
                effect: "hide"
            }
        });

        setTreeElemsWidthes();
    }

    /* Параметр - DOM-элемент */
    function hightlightElem_AddHamburger(currentElem) {
        $('*[dev__shadow="inset"]').removeAttr('dev__shadow');

        // $(e.target).attr('dev__shadow', 'inset');
        $(currentElem).attr('dev__shadow', 'inset');

        showElemInfoOnTop(currentElem);

        $('.dev__hamburger').remove();

        $(currentElem).append('<div class="dev__hamburger">' +
            '<img class="dev__hamburgerImg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/OOjs_UI_icon_menu.svg/768px-OOjs_UI_icon_menu.svg.png" alt="Меню">' +
            '</div>');

        var $this = $(currentElem);
        thisID = $this.attr('id');

        var devMenuItems = [
            {
                'className': 'dev__addLibraryElementToEmptyElem dev__popupLink',
                'actionName': 'dev__addLibraryElementToEmptyElem',
                'text': 'Вставить элемент из библиотеки в пустой контейнер',
                'exceptions': ['content__main'],
            }, {
                'className': 'dev__addElementTree dev__popupLink',
                'actionName': 'dev__addElementTree',
                'text': 'Вставить ДЕРЕВО ЭЛЕМЕНТОВ',
                'exceptions': ['content__main'],
            }, {
                'className': 'dev__insertTextAfter dev__popupLink',
                'actionName': 'dev__insertTextAfter',
                'text': 'Вставить текст после дочернего HTML',
                'exceptions': ['content__main'],
            }, {
                'className': 'dev__insertTextBefore dev__popupLink',
                'actionName': 'dev__insertTextBefore',
                'text': 'Вставить текст перед дочерним HTML',
                'exceptions': ['content__main'],
            }, {
                'className': 'dev__insertText dev__popupLink',
                'actionName': 'dev__insertText',
                'text': 'Вставить текст',
                'exceptions': ['content__main'],
            }, {
                'className': 'dev__duplicate',
                'actionName': 'dev__duplicate',
                'text': 'Дублировать',
                'exceptions': ['header', 'site__main', 'footer', 'content__main'],
            }, {
                'className': 'dev__remove',
                'actionName': 'dev__remove',
                'text': 'Удалить',
                'exceptions': ['header', 'site__main', 'footer', 'content__main'],
            },
        ];

        $('.dev__hamburger').append('<ul class="dev__hamburgerMenu"></ul>');

        devMenuItems.forEach(function (item) {
            var exeptionIDs = item.exceptions;

            /* Если ID выбранного на фронте блока есть в массиве Исключений то пункт меню не добавляется */
            if ($.inArray(thisID, exeptionIDs) === -1) {

                /*
                 Если в контейнере есть теги кроме тега .dev__hamburger
                 НЕ ВЫВОДИТЬ пункт меню Вставить текст
                 (item.actionName == 'dev__insertText')
                 */
                if (hasChildsButHamburger($this) && item.actionName == 'dev__insertText') return;


                /*
                 Если в контейнере есть только текст (кроме тега .dev__hamburger)
                 НЕ ВЫВОДИТЬ пункт меню Вставить текст перед дочерним HTML и Вставить текст после дочернего HTML
                 (item.actionName == 'dev__insertTextBefore') и (item.actionName == 'dev__insertTextAfter')
                 */
                if (hasOneChildIsHamburger($this) && item.actionName == 'dev__insertTextBefore') return;
                if (hasOneChildIsHamburger($this) && item.actionName == 'dev__insertTextAfter') return;


                /*
                 Если в контейнере есть только текст В ВИДЕ ПУСТОЙ СТРОКИ либо ПУСТО (кроме тега .dev__hamburger)
                 НЕ ВЫВОДИТЬ пункт меню Вставить элемент из библиотеки в пустой контейнер
                 (item.actionName == 'dev__addLibraryElementToEmptyElem')
                 */
                if (!(hasOneChildIsHamburger($this) && hasNoTextNodes($this)) && (item.actionName == 'dev__addLibraryElementToEmptyElem')) return;
                if (!(hasOneChildIsHamburger($this) && hasNoTextNodes($this)) && (item.actionName == 'dev__addTreeElementToEmptyElem')) return;


                var devMenuItem = '<li class="' + item.className + '" dev__action="' + item.actionName + '">' + item.text + '</li>'
                $('.dev__hamburger').find('ul').append(devMenuItem);
            }
        });
    }

    function set_dev_panels( $elemBtn, devPanel_class = '', devPanelAdd_class = '' ){

        var $elemToEdit = getCurrentElemToEdit_selectedOnViewport($elemBtn);

        /* Создаем Панель с полями и Вставляем её в Конец попапа */
        $elemToEdit.find('.dev__elementTreeWrap').parent().append( create_dev__panelAddInner($elemBtn, devPanel_class) );

        /* Если есть Панель с Элементами, то удаляем её */
        if ($elemBtn.parents('.dev__popup').find('.dev__panel').length) {
            $elemBtn.parents('.dev__popup').find('.dev__panel').remove();
        }

        /* Создаем Панель с элементами и вставляем её Перед Панелью с полями */
        var $devPanel = $elemToEdit.find('.dev__panelAdd');
        $devPanel.before(createDevPanel_withTagsToAdd_list( devPanelAdd_class ));

        /*
         Если атрибут tagname кликнутого элемента совпадает с атрибутом tagname в Списке элементов
         Делаем этот элемент активным
         */
        var $libraryElems = $elemToEdit.find('.dev__panelBody').find('.dev__libraryElem');

        $libraryElems.each(function (index, elem) {

            if ( $(elem).attr('tagname').toLowerCase() === $elemBtn.attr('tagname').toLowerCase() ) {

                $('.dev__libraryElem').removeClass('active');
                $(elem).addClass('active');

                /*$elemToEdit.find('.dev__saveChanges').html('Вставить ' + dataTagName).attr('tagname', dataTagName).removeClass('disabled');*/


                /* Вставляем Поля в Панель с полями */
                inputsArray.forEach(function (item) {

                    var exeptionTAGs = item.exceptions,
                        onlyTAGs = item.only;
                    /* Если ID выбранного на фронте блока есть в массиве Исключений то пункт меню не добавляется */
                    if ($.inArray($(elem).attr('tagname'), exeptionTAGs) === -1 && (onlyTAGs.length === 0 || $.inArray($(elem).attr('tagname'), onlyTAGs) !== -1 )) {

                        if (item.fieldName == 'dev__stylesNameField') {
                            $('.dev__panelAddInner')
                                .find('.dev__panelAddColumn.second')
                                .append('<div class="dev__panelAdd-inputWrap">'+item.input+'</div>'
                            );

                            setTimeout(function(){
                                window.textEditor = initCodeMirror();
                                initCodeMirror();
                            }, 1000);


                        } else {
                            $('.dev__panelAddInner')
                                .find('.dev__panelAddColumn.first')
                                .append('<div class="dev__panelAdd-inputWrap">'+item.input+'</div>'
                                );
                        }
                    }
                });

            }
        });

        /* Берем все поля внутри dev__panelAdd */
        var $inputs = $elemToEdit.find('.dev__panelAddInner').find('input, textarea');

        $inputs.each(function (index, elem) {

            var elemAttrName = $(elem).attr('name');

            if (elemAttrName === 'class' && $.trim($elemBtn.attr('elem_classes'))) {
                $(elem).val($elemBtn.attr('elem_classes'));
            }

            if (elemAttrName === 'id' && $.trim($elemBtn.attr('elem_id'))) {
                $(elem).val($elemBtn.attr('elem_id'));
            }

            if (elemAttrName === 'innerText' && $.trim($elemBtn.attr('elem_innertext'))) {
                $(elem).val($elemBtn.attr('elem_innertext'));
            }

            if (elemAttrName === 'href' && $.trim($elemBtn.attr('elem_href'))) {
                $(elem).val($elemBtn.attr('elem_href'));
            }

            if (elemAttrName === 'file' && $.trim($elemBtn.attr('src'))) {
                var $img = $('<img class="dev__elemTreeImgPreview" src="' + $elemBtn.attr('src') + '">').insertAfter($(elem));

                $img.width($elemBtn.attr('width'));
                $img.height($elemBtn.attr('height'));
            }

            if (elemAttrName === 'elemStyles' && $.trim($elemBtn.attr('elem_styles'))) {
                window.textEditor.setValue($elemBtn.attr('elem_styles'));
            }
        });

        console.log( $elemBtn.attr('tagname') );
        
        $elemToEdit.find('.'+devPanel_class+' .panel-heading').html('Настройте <span class="text-uppercase">' + $elemBtn.attr('tagname') + '</span>');

        setTreeElemsWidthes();
    }


    /* ----------- Создание Начальное выделение основных контейнеров ---------------- */
    (function setInitialElemView() {
        if (isEmpty($('header'))) {
            $('header').css({
                'height': '100px',
                'border': '2px solid #355664',
            });
        }

        if (isEmpty($('footer'))) {
            $('footer').css({
                'height': '100px',
                'border': '2px solid #355664',
            });
        }

        $(window).load(function () {
            if (isEmpty($('.site__main'))) {
                var siteMainHeight = $('.content__main').innerHeight() - $('header').innerHeight();

                $('.site__main').css({
                    'height': siteMainHeight,
                    'border': '2px solid #5cb85c',
                });
            }
        });
    })();
    /* ----------- Создание Начальное выделение основных контейнеров End ------------ */


    /* --------------------------- Создание Devtool --------------------------------- */
    var $devtool = $('<div class="dev__devtool"></div>').prependTo('body');

    $devtool.append('<div class="dev__generate">Отправить</div>');

    $devtool.append('<div class="dev__elemInfo"></div>');
    /* --------------------------- Создание Devtool End ----------------------------- */


    /* ---------------------------------- Click ------------------------------------- */
    $('.wrapper__main').on('click', function (e) {

        var className = e.target.className;

        /*
         1) Выделение активного элемента
         2) вывод название тега и его класса в верхний блок
         3) добавление в активный элемент блока с гамбургером
         4) добавление в блок с гамбургером списка меню
         */
        // if (!className.startsWith('dev__')) {
        if (!$(e.target).is('[class*="dev__"]') && !$(e.target).parents('.CodeMirror').length) {

            hightlightElem_AddHamburger(e.target);

        } else {

            /* Открытие/Закрытие меню по клику на гамбургере */
            $thisElem = $(e.target).parents('.dev__hamburger').parent();

            $(e.target).parent('.dev__hamburger').find('ul').slideToggle();

        }
    });

    $(document).on('click', '.dev__treeElemMenuHumburger', function () {

        $('.dev__treeElemMenuHumburger').not(this).next('.dev__treeElemMenu').hide();

        $(this).next('.dev__treeElemMenu').slideToggle();

    });
    /* ---------------------------------- Click End --------------------------------- */


    /*
     1) Убирает высоты у основных контейнеров установленных при загрузке пустого шаблона
     2) Устанавливает высоты основным контейнерам не давая им схлопнуться
     */
    function setMainContainerOnEvents(e) {
        setNormalHeightMainContainers(e);
        preventCollapsingMainContainers();
    }

    /* Устанавливает высоты основным контейнерам не давая им схлопнуться */
    function preventCollapsingMainContainers() {
        var docHeight = $(document).height(),
            footerHeight = $('footer').outerHeight(),
            headerHeight = $('header').outerHeight(),
            siteMainHeight = docHeight - headerHeight - footerHeight,
            contentMainHeight = headerHeight + siteMainHeight;

        $('.site__main').css({'height': siteMainHeight});

        $('.content__main').css({'height': contentMainHeight});
    }

    /* Убирает высоты у основных контейнеров установленных при загрузке пустого шаблона */
    function setNormalHeightMainContainers(e) {
        var $this = $(e.target).parents('.dev__hamburger').parent(),
            $thisID = $this.attr('id');

        if ($thisID == 'header' || $thisID == 'footer' || $thisID == 'site__main') {
            $this.removeAttr('style');
        }
    }

    /*
     Создание popup:
     1) Навешивание на событие клика по элементу с классом .dev__popupLink
     2) Создание контейнера popup окна и вставка его в контейнер .dev__hamburger
     */
    (function () {
        $(document).on('click', '.dev__popupLink', function (e) {
            var modalHTML = '<div class="dev__popup">' +
                '<div class="dev__popupInner">' +
                '<div class="dev__popupClose">&times;</div>' +
                '<div class="dev__popupWrap">' +
                '<div class="dev__popupContent">' +
                '<div class="dev__popupContainer"></div>' +
                '<div class="dev__btns clearfix">' +
                '<div class="dev__saveChanges btn btn-success pull-left">Сохранить изменения</div>' +
                '<div class="dev__closePopup btn btn-danger pull-right">Закрыть</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="dev__popupOverlay"></div>' +
                '</div>';

            $(this).parents('.dev__hamburger').prepend(modalHTML);

            var dev__actionAttr = $(e.target).attr('dev__action');

            $(this).parents('.dev__hamburger').find('.dev__saveChanges').addClass(dev__actionAttr);

            setTimeout(function () {
                $('.dev__popup').addClass('dev__modalOpen');
            }, 100);
        });

        $(document).on('click', '.dev__popupClose, .dev__closePopup', function (e) {
            $(this).parents('.dev__popup').remove();
        });
    })();


    /* ------------------------------------------------------------------------------------------------------------- */
    /* ------------------------------------------------ ARRAYs ----------------------------------------------------- */
    /* ------------------------------------------------------------------------------------------------------------- */
    var inputsArray = [
        {
            'fieldName': 'dev__classNameField',
            'input': '<div class="form-group dev__classNameField">' +
            '<label for="className__field" class="dev__">Классы</label>' +
            '<input type="text" name="class" class="form-control dev__" id="className__field" placeholder="Введите один класс или несколько через пробел">' +
            '</div>',
            'exceptions': [],
            'only': [],
        }, {
            'fieldName': 'dev__idNameField',
            'input': '<div class="form-group dev__classNameField">' +
            '<label for="idName__field" class="dev__">ID</label>' +
            '<input type="text" name="id" class="form-control dev__" id="idName__field" placeholder="Введите один ID">' +
            '</div>',
            'exceptions': [],
            'only': [],
        }, {
            'fieldName': 'dev__hrefNameField',
            'input': '<div class="form-group dev__hrefField">' +
            '<label for="dev__hrefField" class="dev__">HREF</label>' +
            '<input type="text" name="href" class="form-control dev__" id="dev__hrefField" placeholder="Введите HREF">' +
            '</div>',
            'exceptions': [],
            'only': ['a',],
        }, {
            'fieldName': 'dev__textNameField',
            'input': '<div class="form-group dev__textField">' +
            '<label for="dev__innerTextField" class="dev__">Текст внутри элемента</label>' +
            '<textarea id="dev__innerTextField" class="dev__" name="innerText" rows="4" placeholder="Введите текст.."></textarea>' +
            '</div>',
            'exceptions': ['img'],
            'only': [],
        }, {
            'fieldName': 'dev__fileNameField',
            'input': '<div class="form-group dev__fileField">' +
            '<label for="dev__fileField" class="dev__">Изображение</label>' +
            '<label class="dev__fileFieldInner">' +
            '<span class="glyphicon glyphicon-paperclip dev__"></span>' +
            '<span class="dev__fileFieldInnerText">Добавьте файл</span>' +
            '<input type="file" id="dev__fileField" class="form-control-file dev__" name="file">' +
            '<span class="dev__elemTreeImgPreviewRemove">&times;</span>' +
            '</label>' +
            '</div>',
            'exceptions': [],
            'only': ['img'],
        }, {
            'fieldName': 'dev__stylesNameField',
            'input': '<div class="form-group dev__stylesField">' +
            '<label for="dev__stylesField" class="dev__">Стили CSS</label>' +
            '<textarea id="dev__stylesField" class="dev__" name="elemStyles" rows="4" placeholder=""></textarea>' +
            '</div>',
            'exceptions': [],
            'only': [],
        }, /*{
         'fieldName': 'dev__indentsField',
         'input':     '<div class="dev__indentsWrap">' +
         '<div class="panel panel-primary dev__">' +
         '<div class="panel-body dev__">' +
         '<table class="dev__">' +
         '<tr class="dev__">' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__">' +
         '<input type="text" name="margin-top" class="border-primary dev__">' +
         '</td>' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__"></td>' +
         '</tr>' +
         '<tr class="dev__">' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__">' +
         '<input type="text" name="padding-top" class="dev__">' +
         '</td>' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__"></td>' +
         '</tr>' +
         '<tr class="dev__">' +
         '<td class="dev__">' +
         '<input type="text" name="margin-left" class="dev__">' +
         '</td>' +
         '<td class="dev__">' +
         '<input type="text" name="padding-left" class="dev__">' +
         '</td>' +
         '<td class="dev__">' +
         '<div class="dev__indetsElem">' +
         '<textarea class="dev__" name="innerText" rows="4" placeholder="Введите текст.."></textarea>' +
         '</div>' +
         '</td>' +
         '<td class="dev__">' +
         '<input type="text" name="padding-right" class="dev__">' +
         '</td>' +
         '<td class="dev__">' +
         '<input type="text" name="margin-right" class="dev__">' +
         '</td>' +
         '</tr>' +
         '<tr class="dev__">' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__">' +
         '<input type="text" name="padding-bottom" class="dev__">' +
         '</td>' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__"></td>' +
         '</tr>' +
         '<tr class="dev__">' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__">' +
         '<input type="text" name="margin-bottom" class="dev__">' +
         '</td>' +
         '<td class="text-center dev__"></td>' +
         '<td class="text-center dev__"></td>' +
         '</tr>' +
         '</table>' +
         '</div>' +
         '</div>' +
         '</div>',
         'exceptions': [],
         'only': [],
         },*/
    ];

    var libraryElements = [
        {
            'tagName': 'div',
            'text': 'DIV',
        }, {
            'tagName': 'ul',
            'text': 'UL',
        }, {
            'tagName': 'li',
            'text': 'LI',
        }, {
            'tagName': 'a',
            'text': 'A',
        }, {
            'tagName': 'span',
            'text': 'SPAN',
        }, {
            'tagName': 'p',
            'text': 'P',
        }, {
            'tagName': 'img',
            'text': 'IMG',
        }, {
            'tagName': 'header',
            'text': 'HEADER',
        }, {
            'tagName': 'footer',
            'text': 'FOOTER',
        }
    ];

    /* ------------------------------------------------------------------------------------------------------------- */
    /* ------------------------------------------------ ARRAYs End ------------------------------------------------- */
    /* ------------------------------------------------------------------------------------------------------------- */

    $(document).on('click', '.dev__libraryElem', function () {

        var $this = $(this),
            dataTagName = $this.attr('tagname'),
            dataText = $this.attr('text'),
            submitBtn = $this.parents('.dev__popup').find('.dev__saveChanges'),
            $elemToEdit = getCurrentElemToEdit_selectedOnViewport($this),
            $devBtn = $elemToEdit.find('.dev__elementTree').find('.dev__elemTree__item.active'),
            $elemToGetAttributesValues;

        if (!(dataTagName === 'img' && $devBtn.next('.dev__treeCol').children('.dev__elemTree__i').length > 0)) {

            /* Выделение текущего элемента */
            $('.dev__libraryElem').removeClass('active');
            $this.addClass('active');

            /* Вставка .dev__panelAdd в который помещаются поля для настроек */
            var $panelDev = $this.parents('.dev__popup').find('.dev__panel'),
                $devPanelAdd = create_dev__panelAddInner($this);

            $panelDev.after($devPanelAdd);

            inputsArray.forEach(function (item) {

                var exeptionTAGs = item.exceptions,
                    onlyTAGs = item.only;

                /* Если ID выбранного на фронте блока есть в массиве Исключений то пункт меню не добавляется */
                // if ( $.inArray( dataTagName, exeptionTAGs ) === -1 ) {
                if ($.inArray(dataTagName, exeptionTAGs) === -1 && (onlyTAGs.length === 0 || $.inArray(dataTagName, onlyTAGs) !== -1 )) {
                    /*var classCols = item.fieldName != 'dev__indentsField' ||
                    item.fieldName != 'dev__stylesNameField' ?
                        'col-xs-6' : 'col-xs-6';

                    $('.dev__panelAddInner').append('<div class="' + classCols + '">' + item.input + '</div>');

                    if (item.fieldName == 'dev__stylesNameField') {

                        window.textEditor = initCodeMirror();

                    }*/

                    if (item.fieldName == 'dev__stylesNameField') {
                        $('.dev__panelAddInner')
                            .find('.dev__panelAddColumn.second')
                            .append('<div class="dev__panelAdd-inputWrap">'+item.input+'</div>'
                            );

                        window.textEditor = initCodeMirror();
                    } else {
                        $('.dev__panelAddInner')
                            .find('.dev__panelAddColumn.first')
                            .append('<div class="dev__panelAdd-inputWrap">'+item.input+'</div>'
                            );
                    }
                }
            });

            if ($this.closest('.dev__panel').hasClass('dev__devPanel__addElementTree')) {

                $devBtn.attr('tagname', dataTagName);
                $devBtn.find('.dev__elemTree__itemTagname').text(dataText);

                $elemToGetAttributesValues = $devBtn;

                create_treeElemsMenu($devBtn);
                setTreeElemsWidthes();
            } else {
                $elemToGetAttributesValues = $this.closest('.dev__panelBody');

                /* Передача атрибутов добавляемого элемента кнопке + вставка текста кнопки плюс удаление класса disabled */
                submitBtn.html('Вставить ' + dataText).attr('tagname', dataTagName).attr('text', dataText).removeClass('disabled');
            }

            if ($elemToGetAttributesValues.attr('elem_classes')) {
                $elemToEdit.find('.dev__panelAdd').find('input[name="class"]').val($elemToGetAttributesValues.attr('elem_classes'));
            }

            if ($elemToGetAttributesValues.attr('elem_id')) {
                $elemToEdit.find('.dev__panelAdd').find('input[name="id"]').val($elemToGetAttributesValues.attr('elem_id'));
            }

            if ($elemToGetAttributesValues.attr('elem_href')) {
                $elemToEdit.find('.dev__panelAdd').find('input[name="href"]').val($elemToGetAttributesValues.attr('elem_href'));
            }

            if ($elemToGetAttributesValues.attr('elem_innerText')) {
                $elemToEdit.find('.dev__panelAdd').find('textarea[name="innerText"]').val($elemToGetAttributesValues.attr('elem_innertext'));
            }

            if ($elemToGetAttributesValues.attr('elem_styles')) {
                window.textEditor.setValue($elemToGetAttributesValues.attr('elem_styles'));
            }

            if ($elemToGetAttributesValues.attr('src')) {
                var $img = $('<img class="dev__elemTreeImgPreview">').insertAfter($elemToEdit.find('.dev__panelAdd').find('input[name="file"]'));

                $img.attr('src', $elemToGetAttributesValues.attr('src'));
                $img.width($elemToGetAttributesValues.attr('width'));
                $img.height($elemToGetAttributesValues.attr('height'));
            }

        } else {
            showNotificationOnTheTopOfWindow('Нельзя изменить на IMG если внутри есть дочерние элементы');
        }
    });

    /*   $(document).on('click', '.dev__devPanel__addElementTree .dev__libraryElem', function(e){


     });*/

    /* ------------------------------------------------------------------------------------------------------------- */
    /* ----------------------------------------------- ACTIONS ----------------------------------------------------- */
    /* ------------------------------------------------------------------------------------------------------------- */


    /*
     Вставка текста в пустой элемент
     */
    (function () {
        $(document).on('click', '.dev__insertText', function (e) {

            if (e.target.tagName == 'LI') {

                var $currentElemToEdit = getCurrentElemToEdit_selectedOnViewport($(this));

                var elemText = $currentElemToEdit.clone().children().remove().end().text().trim();

                var $textarea = $('<textarea class="dev__textarea" placeholder="Введите текст..." value="" name="dev__insertText" rows="4">').appendTo('.dev__popupContainer');

                if (elemText) {
                    $textarea.html(elemText);
                }

                var dev__actionAttr = $(this).attr('dev__action');

                $(this).parents('.dev__hamburger').find('.dev__saveChanges').addClass(dev__actionAttr);

            } else if ($(e.target).hasClass('dev__saveChanges')) {

                var textToInsert = $(this).parents('.dev__hamburger').find('textarea[name="dev__insertText"]').val();

                textToInsert = $('<p>' + textToInsert + '</p>').text();

                // $(this).parents('.dev__hamburger').parent().prepend(textToInsert);
                var aaa = $(this).parents('.dev__hamburger').parent().contents().first().replaceWith(textToInsert);

                console.log(aaa);
            }
            setMainContainerOnEvents(e);
        });
    })();


    /*
     Вставка текста перед дочерним HTML
     */
    (function () {
        $(document).on('click', '.dev__insertTextBefore', function (e) {

            var $currentElemToEdit = getCurrentElemToEdit_selectedOnViewport($(this));

            var firstNode = $currentElemToEdit.contents().first()[0];

            if (e.target.tagName == 'LI') {

                if (firstNode.nodeType == 3) {
                    var elemText = firstNode.textContent.trim();
                }

                var $textarea = $('<textarea class="dev__textarea" placeholder="Введите текст..." value="" name="dev__insertTextBefore" rows="4">').appendTo('.dev__popupContainer');

                if (elemText) {
                    $textarea.html(elemText);
                }

                var dev__actionAttr = $(this).attr('dev__action');

                $(this).parents('.dev__hamburger').find('.dev__saveChanges').addClass(dev__actionAttr);

            } else if ($(e.target).hasClass('dev__saveChanges')) {

                var textToInsert = $(this).parents('.dev__hamburger').find('textarea[name="dev__insertTextBefore"]').val();

                textToInsert = $('<p>' + textToInsert + '</p>').text();

                if (firstNode.nodeType == 3) {

                    console.log($(this).parents('.dev__hamburger').parent().contents().first());

                    $(this).parents('.dev__hamburger').parent().contents().first().replaceWith(textToInsert);
                } else if (firstNode.nodeType == 1) {
                    $(this).parents('.dev__hamburger').parent().prepend(textToInsert);
                }

            }
            setMainContainerOnEvents(e);
        });
    })();


    /*
     Вставка текста после дочернего HTML
     */
    (function () {
        $(document).on('click', '.dev__insertTextAfter', function (e) {

            var $currentElemToEdit = getCurrentElemToEdit_selectedOnViewport($(this));

            var lastNode = $currentElemToEdit.contents().last('.dev__hamburger')[0].previousSibling;

            if (e.target.tagName == 'LI') {

                if (lastNode.nodeType == 3) {
                    var elemText = lastNode.textContent.trim();
                }

                var $textarea = $('<textarea class="dev__textarea" placeholder="Введите текст для вставки после..." value="" name="dev__insertTextAfter" rows="4"></textarea>').appendTo('.dev__popupContainer');

                if (elemText) {
                    $textarea.html(elemText);
                }

                var dev__actionAttr = $(this).attr('dev__action');

                $(this).parents('.dev__hamburger').find('.dev__saveChanges').addClass(dev__actionAttr);

            } else if ($(e.target).hasClass('dev__saveChanges')) {

                var textToInsert = $(this).parents('.dev__hamburger').find('textarea[name="dev__insertTextAfter"]').val();

                textToInsert = $('<p>' + textToInsert + '</p>').text();

                if (lastNode.nodeType == 3) {

                    $(this).parents('.dev__hamburger').parent().contents().last('.dev__hamburger')[0].previousSibling.textContent = textToInsert;

                } else if (lastNode.nodeType == 1) {
                    $(this).parents('.dev__hamburger').before(textToInsert);
                }

            }
            setMainContainerOnEvents(e);
        });
    })();


    /*
     Вставить элемент из библиотеки в пустой контейнер
     */
    (function () {
        $(document).on('click', '.dev__addLibraryElementToEmptyElem', function (e) {

            if (e.target.tagName == 'LI') {

                var $devPanel = createDevPanel_withTagsToAdd_list('dev__devPanel__addLibraryElementToEmptyElem');

                $devPanel.appendTo('.dev__popupContainer')

                addClassDisabled_to_devSaveChangesBtn($(e.target));

                set_dev_panels( $elemBtn, '', '' );

            } else if ($(e.target).hasClass('dev__saveChanges')) {

                if (!$(e.target).hasClass('disabled')) {

                    var newElemTagname = $(e.target).attr('tagname'),
                        $newElem = $('<' + newElemTagname + '>'),
                        $newElemInputs = $(e.target).parents('.dev__popup').find('.dev__panelAddBody').find('input, textarea'),
                        elemClassName;
                    /*elemPaddings = [],
                     elemMargins = []*/

                    $newElemInputs.each(function (i, elem) {

                        var $thisInput = $(elem),
                            inputName = $thisInput.attr('name'),
                            inputValue = $thisInput.val().trim();

                        if (inputName == 'id') {
                            if (inputValue) {
                                $newElem.attr('id', inputValue);
                            }
                        }

                        if (inputName == 'href') {
                            if (inputValue) {
                                $newElem.attr('href', inputValue);
                            }
                        }

                        if (inputName == 'innerText') {
                            if (inputValue) {
                                $newElem.html(inputValue);
                            }
                        }

                        if (inputName == 'class') {
                            if (inputValue) {
                                $newElem.addClass(inputValue);
                                elemClassName = inputValue;
                            }
                        }


                        /*function createIndentsArray(indentsArray, indentsName) {
                         if ( inputName.indexOf( indentsName ) >= 0 ) {
                         var inputObj = new Object();

                         if ( inputValue ) {
                         inputObj['name'] = inputName;
                         inputObj['value'] = inputValue;
                         } else {
                         inputObj['name'] = inputName;
                         inputObj['value'] = '0';
                         }

                         indentsArray.push(inputObj);
                         }
                         }

                         createIndentsArray(elemPaddings, 'padding');
                         createIndentsArray(elemMargins, 'margin');*/
                    });

                    /* function getResultIndentsString ( indentsArray, indentsName ) {
                     var top, right, bottom, left;
                     indentsArray.forEach(function( indentValues ){
                     if ( indentValues.name.indexOf('top') >= 0 ) top = indentValues.value;
                     if ( indentValues.name.indexOf('right') >= 0 ) right = indentValues.value;
                     if ( indentValues.name.indexOf('bottom') >= 0 ) bottom = indentValues.value;
                     if ( indentValues.name.indexOf('left') >= 0 ) left = indentValues.value;
                     });
                     return indentsName+': '+top+' '+right+' '+bottom+' '+left+';';
                     }*/

                    var elemStylesArr = [],
                        $thisHamburger = $(e.target).parents('.dev__hamburger'),
                        $thisSection = $thisHamburger.parent();

                    /*elemStylesArr.push( getResultIndentsString( elemMargins, 'margin' ) );
                     elemStylesArr.push( getResultIndentsString( elemPaddings, 'padding' ) );

                     var elemClassName = '.'+elemClassName;
                     var elemStylesString = elemClassName +'{';

                     elemStylesArr.forEach(function(styleItem){
                     elemStylesString += styleItem;
                     });

                     elemStylesString += '}';

                     if ( !$thisSection.next().is('style') ) {
                     $thisSection.after('<style type="text/css">'+elemStylesString+'</style>');
                     } else {
                     // $thisSection.next('style').
                     }*/


                    $thisSection.prepend($newElem);

                    hightlightElem_AddHamburger($newElem[0]);

                }
            }
            setMainContainerOnEvents(e);
        });
    })();


    /*
     Вставить ДЕРЕВО элементов в пустой контейнер
     */
    (function () {
        $(document).on('click', '.dev__addElementTree', function (e) {

            if (e.target.tagName == 'LI') {

                /* Деактивируем кнопку Сохранить */
                /*addClassDisabled_to_devSaveChangesBtn( $(e.target) );*/
                /* Создаем dev__elementTree */
                $('.dev__popupContainer').prepend(create_dev__elementTree());

                /*
                 1) Создание первой колонки для выделенного на фронте элемента
                 2) Вставка в эту колонку кнопки с информацией об этом элементе
                 */
                var $elemToEdit = getCurrentElemToEdit_selectedOnViewport($(e.target));

                $('.dev__elementTree').append('<div class="dev__treeCol col_0"></div>');

                var classesArray = getElemClassesArray($elemToEdit);

                var $elemToEditBtn = create_devElemTreeItem('dev__elemToEdit active', $elemToEdit.prop('tagName')),
                    $elemBtn = $elemToEditBtn.find('.dev__elemTree__item');

                if ($elemToEdit.attr('class')) {
                    $elemBtn.attr('elem_classes', $elemToEdit.attr('class'));
                }

                if ($elemToEdit.attr('id')) {
                    $elemBtn.attr('elem_id', $elemToEdit.attr('id'));
                }

                $('.dev__elementTree').find('.col_0').append($elemToEditBtn);

                classesArray.forEach(function (classItem) {

                    $('.dev__elemTree__itemClasses').append('<div class="dev__elemTree__className">' +
                        '<strong>.</strong>' + classItem +
                        '</div>');
                });

                create_treeElemsMenu( $elemBtn );

                /* ------------------------>>> !!!!!!!!!!!!!!!!!!!!!!!!!!!!! <<<------------------------------------------------- */

                set_dev_panels( $elemBtn, 'dev__devPanelAdd__addElementTree', 'dev__devPanel__addElementTree' );

                /*/!* Создаем Панель с полями и Вставляем её в Конец попапа *!/
                $elemToEdit.find('.dev__elementTreeWrap').parent().append(create_dev__panelAddInner($elemBtn, 'dev__devPanelAdd__addElementTree'));

                /!* Если есть Панель с Элементами, то удаляем её *!/
                if ($elemBtn.parents('.dev__popup').find('.dev__panel').length) {
                    $elemBtn.parents('.dev__popup').find('.dev__panel').remove();
                }

                /!* Создаем Панель с элементами и вставляем её Перед Панелью с полями *!/
                var $devPanel = $elemToEdit.find('.dev__panelAdd');
                $devPanel.before(createDevPanel_withTagsToAdd_list('dev__devPanel__addElementTree'));

                /!*
                 Если атрибут tagname кликнутого элемента совпадает с атрибутом tagname в Списке элементов
                 Делаем этот элемент активным
                 *!/
                var $libraryElems = $elemToEdit.find('.dev__panelBody').find('.dev__libraryElem');
                
                $libraryElems.each(function (index, elem) {

                    if ( $(elem).attr('tagname').toLowerCase() === $elemBtn.attr('tagname').toLowerCase() ) {

                        $('.dev__libraryElem').removeClass('active');
                        $(elem).addClass('active');

                        /!*$elemToEdit.find('.dev__saveChanges').html('Вставить ' + dataTagName).attr('tagname', dataTagName).removeClass('disabled');*!/

                        /!* Вставляем Поля в Панель с полями *!/
                        inputsArray.forEach(function (item) {

                            var exeptionTAGs = item.exceptions,
                                onlyTAGs = item.only;
                            /!* Если ID выбранного на фронте блока есть в массиве Исключений то пункт меню не добавляется *!/
                            if ($.inArray($(elem).attr('tagname'), exeptionTAGs) === -1 && (onlyTAGs.length === 0 || $.inArray($(elem).attr('tagname'), onlyTAGs) !== -1 )) {
                                var classCols = item.fieldName == 'dev__textNameField' ||
                                item.fieldName == 'dev__stylesNameField' ?
                                    'col-xs-6' : 'col-xs-6';

                                $('.dev__panelAddInner').append('<div class="' + classCols + '">' + item.input + '</div>');

                                if (item.fieldName == 'dev__stylesNameField') {

                                    window.textEditor = initCodeMirror();

                                }

                            }
                        });

                    }
                });

                /!* Берем все поля внутри dev__panelAdd *!/
                var $inputs = $elemToEdit.find('.dev__panelAddInner').find('input, textarea');

                $inputs.each(function (index, elem) {

                    var elemAttrName = $(elem).attr('name');

                    if (elemAttrName === 'class' && $.trim($elemBtn.attr('elem_classes'))) {
                        $(elem).val($elemBtn.attr('elem_classes'));
                    }

                    if (elemAttrName === 'id' && $.trim($elemBtn.attr('elem_id'))) {
                        $(elem).val($elemBtn.attr('elem_id'));
                    }

                    if (elemAttrName === 'innerText' && $.trim($elemBtn.attr('elem_innertext'))) {
                        $(elem).val($elemBtn.attr('elem_innertext'));
                    }

                    if (elemAttrName === 'href' && $.trim($elemBtn.attr('elem_href'))) {
                        $(elem).val($elemBtn.attr('elem_href'));
                    }

                    if (elemAttrName === 'file' && $.trim($elemBtn.attr('src'))) {
                        var $img = $('<img class="dev__elemTreeImgPreview" src="' + $elemBtn.attr('src') + '">').insertAfter($(elem));

                        $img.width($elemBtn.attr('width'));
                        $img.height($elemBtn.attr('height'));
                    }

                    if (elemAttrName === 'elemStyles' && $.trim($elemBtn.attr('elem_styles'))) {
                        window.textEditor.setValue($elemBtn.attr('elem_styles'));
                    }
                });

                $elemToEdit.find('.dev__devPanelAdd__addElementTree .panel-heading').html('Настройте <span class="text-uppercase">' + $elemBtn.attr('tagname') + '</span>');

                setTreeElemsWidthes();*/
                
                
                /* ------------------------>>> !!!!!!!!!!!!!!!!!!!!!!!!!!!!! End <<<------------------------------------------------- */

                setElemTreeLines();

            } else if ($(e.target).hasClass('dev__saveChanges')) {

                if (!$(e.target).hasClass('disabled')) {
                    
                    var $elemToEdit = getCurrentElemToEdit_selectedOnViewport($(e.target)),
                        $elemTreeToEditContainer = $('.dev__elemToEdit_wrap'),
                        $elemTreeToEdit = $('.dev__elemToEdit');

                    function createNewElemFromElemTree( $elemInElemTree ) {
                        var newElemTagname = $elemInElemTree.attr('tagname'),
                            $newElem = $('<' + newElemTagname + '>'),
                            elem_classes   = $elemInElemTree.attr('elem_classes'),
                            elem_id        = $elemInElemTree.attr('elem_id'),
                            elem_href      = $elemInElemTree.attr('elem_href'),
                            src            = $elemInElemTree.attr('src'),
                            elem_innertext = $elemInElemTree.attr('elem_innertext'),
                            elem_styles    = $elemInElemTree.attr('elem_styles');

                        if ( elem_classes !== undefined && elem_classes !== '' ) {
                            $newElem.attr('class', elem_classes);
                        }
                        if ( elem_id !== undefined && elem_id !== '' ) {
                            $newElem.attr('id', elem_id);
                        }
                        if ( elem_href !== undefined && elem_href !== '' ) {
                            $newElem.attr('href', elem_href);
                        }
                        if ( src !== undefined && src !== '' ) {
                            $newElem.attr('src', src);
                       }
                        if ( elem_innertext !== undefined && elem_innertext !== '' ) {
                            $newElem.text(elem_innertext);
                        }
                        if ( elem_styles !== undefined && elem_styles !== '' ) {
                            $newElem.attr('elem_styles', elem_styles);
                        }

                        console.log( $newElem );
                    }

                    createNewElemFromElemTree( $elemTreeToEdit );



                    var newElemTagname = $(e.target).attr('tagname'),
                        $newElem = $('<' + newElemTagname + '>'),
                        $newElemInputs = $(e.target).parents('.dev__popup').find('.dev__panelAddBody').find('input, textarea'),
                        elemClassName;

                    $newElemInputs.each(function (i, elem) {

                        var $thisInput = $(elem),
                            inputName = $thisInput.attr('name'),
                            inputValue = $thisInput.val().trim();

                        if (inputName == 'id') {
                            if (inputValue) {
                                $newElem.attr('id', inputValue);
                            }
                        }

                        if (inputName == 'href') {
                            if (inputValue) {
                                $newElem.attr('href', inputValue);
                            }
                        }

                        if (inputName == 'innerText') {
                            if (inputValue) {
                                $newElem.html(inputValue);
                            }
                        }

                        if (inputName == 'class') {
                            if (inputValue) {
                                $newElem.addClass(inputValue);
                                elemClassName = inputValue;
                            }
                        }
                    });

                }
            }
            setMainContainerOnEvents(e);
        });

        /* Клик по кнопке Элемент в dev__elemTree */
        $(document).on('click', '.dev__elemTree__item', function (e) {

            /* Если клик не по Гамбургеру ИЛИ не по Пункту меню Гамбургера */
            if (e.target.className !== 'dev__treeElemMenuItem' && e.target.className !== 'dev__treeElemMenuHumburger') {

                var $this = $(this),
                    $elemToEdit = getCurrentElemToEdit_selectedOnViewport($(e.target)),
                    dataTagName = $(this).attr('tagname');

                /* Выделяем активный Элемент дерева */
                $elemToEdit.find('.dev__elemTree__item').removeClass('active');
                $this.addClass('active');

                set_dev_panels( $this, 'dev__devPanelAdd__addElementTree', 'dev__devPanel__addElementTree' );

                /*/!* Создаем Панель с полями и Вставляем её в Конец попапа *!/
                $elemToEdit.find('.dev__elementTreeWrap').parent().append(create_dev__panelAddInner($(this), 'dev__devPanelAdd__addElementTree'));

                /!* Если есть Панель с Элементами, то удаляем её *!/
                if ($this.parents('.dev__popup').find('.dev__panel').length) {
                    $this.parents('.dev__popup').find('.dev__panel').remove();
                }

                /!* Создаем Панель с элементами и вставляем её Перед Панелью с полями *!/
                var $devPanel = $elemToEdit.find('.dev__panelAdd');
                $devPanel.before(createDevPanel_withTagsToAdd_list('dev__devPanel__addElementTree'));

                /!*
                 Если атрибут tagname кликнутого элемента совпадает с атрибутом tagname в Списке элементов
                 Делаем этот элемент активным
                 *!/
                var $libraryElems = $elemToEdit.find('.dev__panelBody').find('.dev__libraryElem');

                $libraryElems.each(function (index, elem) {

                    if ($(elem).attr('tagname').toLowerCase() === dataTagName.toLowerCase()) {

                        $('.dev__libraryElem').removeClass('active');
                        $(elem).addClass('active');

                        /!*$elemToEdit.find('.dev__saveChanges').html('Вставить ' + dataTagName).attr('tagname', dataTagName).removeClass('disabled');*!/

                        /!* Вставляем Поля в Панель с полями *!/
                        inputsArray.forEach(function (item) {

                            var exeptionTAGs = item.exceptions,
                                onlyTAGs = item.only;
                            /!* Если ID выбранного на фронте блока есть в массиве Исключений то пункт меню не добавляется *!/
                            if ($.inArray($(elem).attr('tagname'), exeptionTAGs) === -1 && (onlyTAGs.length === 0 || $.inArray($(elem).attr('tagname'), onlyTAGs) !== -1 )) {
                                var classCols = item.fieldName == 'dev__textNameField' ||
                                item.fieldName == 'dev__stylesNameField' ?
                                    'col-xs-6' : 'col-xs-6';

                                $('.dev__panelAddInner').append('<div class="' + classCols + '">' + item.input + '</div>');

                                if (item.fieldName == 'dev__stylesNameField') {

                                    window.textEditor = initCodeMirror();

                                }

                            }
                        });

                    }
                });

                /!* Берем все поля внутри dev__panelAdd *!/
                var $inputs = $elemToEdit.find('.dev__panelAddInner').find('input, textarea');

                $inputs.each(function (index, elem) {

                    var elemAttrName = $(elem).attr('name');

                    if (elemAttrName === 'class' && $.trim($this.attr('elem_classes'))) {
                        $(elem).val($this.attr('elem_classes'));
                    }

                    if (elemAttrName === 'id' && $.trim($this.attr('elem_id'))) {
                        $(elem).val($this.attr('elem_id'));
                    }

                    if (elemAttrName === 'innerText' && $.trim($this.attr('elem_innertext'))) {
                        $(elem).val($this.attr('elem_innertext'));
                    }

                    if (elemAttrName === 'href' && $.trim($this.attr('elem_href'))) {
                        $(elem).val($this.attr('elem_href'));
                    }

                    if (elemAttrName === 'file' && $.trim($this.attr('src'))) {
                        var $img = $('<img class="dev__elemTreeImgPreview" src="' + $this.attr('src') + '">').insertAfter($(elem));

                        $img.width($this.attr('width'));
                        $img.height($this.attr('height'));
                    }

                    if (elemAttrName === 'elemStyles' && $.trim($this.attr('elem_styles'))) {
                        window.textEditor.setValue($this.attr('elem_styles'));
                    }
                });

                $elemToEdit.find('.dev__devPanelAdd__addElementTree .panel-heading').html('Настройте <span class="text-uppercase">' + $this.attr('tagname') + '</span>');

                setTreeElemsWidthes();*/
            }
        });


        $(document).on('click', '.dev__treeElemMenuItem', function (e) {
            $this = $(this);

            $('.dev__treeElemMenu').hide();

            /* Вставить внутрь */
            if ($this.attr('action') === 'dev__elemTreeInsertChild') {

                var $elemTreeBtn = create_devElemTreeItem('active', 'DIV'),
                    $elemBtn = $elemTreeBtn.find('.dev__elemTree__item');

                $('.dev__elemTree__item').removeClass('active');

                $elemTreeBtn.appendTo($this.closest('.dev__elemTree__item').next('.dev__treeCol'));

                create_treeElemsMenu( $elemBtn );

                $this.parents('.dev__popup').find('.dev__saveChanges').attr('action', $this.attr('action'));

                set_dev_panels( $elemBtn, 'dev__devPanelAdd__addElementTree', 'dev__devPanel__addElementTree' );

                $(".dev__treeCol").sortable();

            }
            /* Вставить после */
            if ($this.attr('action') === 'dev__elemTreeInsertAfter') {

                var $elemTreeBtn = create_devElemTreeItem('active', 'DIV'),
                    $elemBtn = $elemTreeBtn.find('.dev__elemTree__item');

                $('.dev__elemTree__item').removeClass('active');

                $elemTreeBtn.insertAfter($this.closest('.dev__elemTree__i'));

                create_treeElemsMenu( $elemBtn );

                $this.parents('.dev__popup').find('.dev__saveChanges').attr('action', $this.attr('action'));

                set_dev_panels( $elemBtn, 'dev__devPanelAdd__addElementTree', 'dev__devPanel__addElementTree' );

                $(".dev__treeCol").sortable();

            }
            /* Вставить перед */
            if ($this.attr('action') === 'dev__elemTreeInsertBefore') {

                var $elemTreeBtn = create_devElemTreeItem('active', 'DIV'),
                    $elemBtn = $elemTreeBtn.find('.dev__elemTree__item');

                $('.dev__elemTree__item').removeClass('active');

                $elemTreeBtn.insertBefore($this.closest('.dev__elemTree__i'));

                create_treeElemsMenu( $elemBtn );

                $this.parents('.dev__popup').find('.dev__saveChanges').attr('action', $this.attr('action'));

                set_dev_panels( $elemBtn, 'dev__devPanelAdd__addElementTree', 'dev__devPanel__addElementTree' );

                $(".dev__treeCol").sortable();

            }
            /* Удалить */
            if ($this.attr('action') === 'dev__elemTreeRemoveElem') {

                $this.closest('.dev__elemTree__i').remove();

            }
            /* Дублировать */
            if ($this.attr('action') === 'dev__elemTreeCopyElem') {

                var $elemCloned = $this.closest('.dev__elemTree__i').clone();

                $this.closest('.dev__elemTree__i').after($elemCloned);

                $(".dev__treeCol").sortable();

            }

            setElemTreeLines();

            setTreeElemsWidthes();
        });

        $(document).on('input', '.dev__panelAdd input, .dev__panelAdd textarea', function () {

            var $elemToEdit = getCurrentElemToEdit_selectedOnViewport($(this)),
                $elemToAddAttributesValues;

            if ($elemToEdit.find('.dev__elementTree').length) {
                $elemToAddAttributesValues = $elemToEdit.find('.dev__elementTree').find('.dev__elemTree__item.active');
            } else {
                $elemToAddAttributesValues = $elemToEdit.find('.dev__panelBody ');
            }
            // var $devBtn = $elemToEdit.find('.dev__elementTree').find('.dev__elemTree__item.active');

            if ($(this).attr('name') === 'id') {
                $elemToAddAttributesValues.attr('elem_id', $(this).val());
            }

            if ($(this).attr('name') === 'class') {
                $elemToAddAttributesValues.attr('elem_classes', $(this).val());

                var classesArray = getElemClassesArray($(this).val());

                if ($elemToAddAttributesValues.find('.dev__elemTree__itemClasses').length) {
                    $classesWrap = $elemToAddAttributesValues.find('.dev__elemTree__itemClasses');

                    $classesWrap.html('');

                    classesArray.forEach(function (classItem) {
                        $classesWrap.append('<div class="dev__elemTree__className">' + '<strong>.</strong>' + classItem + '</div>');
                    });
                }
            }

            if ($(this).attr('name') === 'innerText') {
                $elemToAddAttributesValues.attr('elem_innerText', $(this).val());
            }

            if ($(this).attr('name') === 'href') {
                $elemToAddAttributesValues.attr('elem_href', $(this).val());
            }

        });


        function getSetElemTreeImgPreview(input) {

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;

                    var $elemToEdit = getCurrentElemToEdit_selectedOnViewport($(input)),
                        $elemToAddAttributesValues;

                    if ($elemToEdit.find('.dev__elementTree').length) {
                        $elemToAddAttributesValues = $elemToEdit.find('.dev__elementTree').find('.dev__elemTree__item.active');
                    } else {
                        $elemToAddAttributesValues = $elemToEdit.find('.dev__panelBody ');
                    }

                    var imageWidth,
                        imageHeight;

                    image.onload = function () {

                        var $img = $('<img class="dev__elemTreeImgPreview">').attr('src', this.src);

                        $(input).closest('.dev__fileFieldInner').find('img').remove()

                        $(input).after($img);

                        if (this.width >= this.height) {
                            imageHeight = 'auto';
                            imageWidth = '100%';
                        } else {
                            imageHeight = '100%';
                            imageWidth = 'auto';
                        }

                        $(input).closest('.dev__fileFieldInner').find('.dev__elemTreeImgPreview').css({
                            'height': imageHeight,
                            'width': imageWidth,
                        });

                        $elemToAddAttributesValues.attr('src', e.target.result);
                        $elemToAddAttributesValues.attr('width', imageWidth);
                        $elemToAddAttributesValues.attr('height', imageHeight);
                    }
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

        $(document).on('change', '#dev__fileField', function () {
            getSetElemTreeImgPreview(this);
        });

        $(document).on('click', 'label.dev__fileFieldInner', function (e) {
            if (e.target.className === 'dev__elemTreeImgPreviewRemove') {
                e.preventDefault();

                $(e.target).prev('img').remove();

                var $elemToEdit = getCurrentElemToEdit_selectedOnViewport($(e.target)),
                    $devBtn = $elemToEdit.find('.dev__elementTree').find('.dev__elemTree__item.active');

                $devBtn.attr('src', '');
                $devBtn.attr('width', '');
                $devBtn.attr('height', '');
            }
        });

    })();


    /*
     Дублирование элемента и вставка сразу после него
     */
    (function () {
        $(document).on('click', '.dev__duplicate', function () {

            console.log('clicked');
            var $elemCloned = $(this).parents('.content').clone().removeClass('menu__opened');

            $elemCloned.insertAfter($(this).parents('.content')).find('ul').hide();

        });
    })();


    /*
     Удаление элемента
     */
    (function () {
        $(document).on('click', '.dev__remove', function () {
            $(this).parents('.content').remove();
        });
    })();


    $(document).on('click', '.dev__saveChanges.dev__addElementTree', function (e) {

        var base = getCurrentElemToEdit_selectedOnViewport($(e.target)).find('.dev__elemTree__item.active').attr('src');

        var $rootElem = $('.dev__elemToEdit');

        console.log( getAttributes( $rootElem ) );

        $.ajax({
            type: 'POST',
            url: 'image-handler.php',
            data: {
                base64: base
            },
            success: function (response) {

            },
            error: function (response) {

            },
        });
    });


});