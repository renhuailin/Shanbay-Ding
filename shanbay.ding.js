function main(option) {
	
	//重主义ReviewDetailView 的 initialize，添加'Y'和'N'两个shortcuts
    ReviewDetailView.prototype.initialize =  function () {
        var self = this;
        this.setup_events();
        this.set_syllables();
        this.review_view = this.options['review_view']
        this.prev_mode = this.options['prev_mode']
        this.result = this.options['result']
        this.model.bind('examples:reset', function () {
            self.render_examples(true)
        }, this);
        this.model.bind('mynotes:reset', self.render_my_notes, this);
        this.model.bind('usernotes:reset', self.render_user_notes, this);
        this.render();
        $.Shortcuts.stop();
        $.Shortcuts.empty();
        var shortcut_list_name = "detail_" + this.model.id;
        this.shortcut_name = shortcut_list_name;        
        var shortcuts = $.Shortcuts.add({
            type: 'up',
            mask: 'y',
            handler: function () {
                if ($('.learning-detail-container').hasClass('hide')) {
                    self.known_word();
                }
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 'n',
            handler: function (e) {
                if ($('.learning-detail-container').hasClass('hide')) {
                    self.unknown_word();
                } else {
                    self.forget_word();
                }
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 'Right,period,d',
            handler: function () {
                if ($('.learning-hint-container').hasClass('hide')) {
                    self.next();
                }
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 'Left,comma,a',
            handler: function () {
                self.prev();
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 's',
            handler: function () {
                self.spell_popup();
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 'r',
            handler: function () {
                self.toggle_roots_detail();
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 'f',
            handler: function () {
                self.trigger_prompt_word_tree();
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 'p',
            handler: function (e) {
                self.speak(e);
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 'Ctrl+Shift+rbracket',
            handler: function () {
                alert('请使用快捷键:"9"')
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: '9,k9',
            handler: function (e) {
                self.pass(e);
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: 'v',
            handler: function () {
                self.show_all_definitions();
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: '1, k1',
            handler: function (e) {
                if ($('.learning-detail-container').hasClass('hide')) {
                    self.known_word();
                }
            },
            list: shortcut_list_name
        }).add({
            type: 'up',
            mask: '2, k2',
            handler: function (e) {
                if ($('.learning-detail-container').hasClass('hide')) {
                    self.unknown_word();
                } else {
                    self.forget_word();
                }
            },
            list: shortcut_list_name
        });
		
        setTimeout(function () {
            shortcuts.start(shortcut_list_name);
        }, 100);
    }
	
	//修复了在提示的最后一步“查看详细”时，按下's'键时会弹出一个黑层的问题。
    ReviewDetailView.prototype.spell_popup = function () {
		if ($(".learning-detail-container").hasClass("hide")) {
			return;
		}
        $('.main-body').removeClass('new-main-body');
        var self = this;
        $.Shortcuts.stop(self.shortcut_name);
        this.$el.find('#spell-modal-box').html($('#spell-modal-tmpl').tmpl(this.model.toJSON()));
        var modal = this.$el.find('.spell-modal');
        modal.modal();
        this.$el.find('.word .content').hide();
        this.$el.find('#learning-examples-box').hide();
        modal.on('hidden', function () {
            $.Shortcuts.start(self.shortcut_name);
            setTimeout(function () {
                $('.modal-backdrop').fadeTo('slow', 0);
                $('.modal-backdrop').click();
            }, 500);
            $('.modal-backdrop').fadeTo('slow', 0);
            $('.modal-backdrop').click();
            self.$el.find('.word .content').show();
            self.$el.find('#learning-examples-box').show();
            $('.main-body').addClass('new-main-body');
        });
        modal.on('hide', function () {
            modal.find('#spell-box').blur();
        });
        setTimeout(function () {
            modal.find('#spell-box').focus();
        }, 10);
        modal.find('#spell-box').focus();
    }	
	
	//页面跳转提示，
	if ( document.URL.match("bdc/review") ) {
		$(window).bind('beforeunload', function(){
		  return '亲，你正在背单词中，确定要离开吗?';
		});
	}	

} // end of main 整个main将被注入

// 获取选项后注入到主页面
sendMessage({
    action: "getOptions"
}, function (response) {
    var script = document.createElement("script");
    var option = JSON.stringify(response);
    script.textContent = "(" + main.toString() + ")(" + option + ");//@ sourceURL=shanbay_plus.js";
    document.body.appendChild(script);
});

