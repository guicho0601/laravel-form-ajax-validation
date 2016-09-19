// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = "laravelAjaxValidate",
        defaults = {
            validation_request_class: null,
            on_start: false,
            auto_focus: true,
            validation_url: null
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.validated = false;
        this.button_submit = false;

        this.init();
    }

    Plugin.prototype.init = function () {

        var self = this;
        $(this.element).on('submit', function () {
            if (self.validated == true) {
                if ($(self.element).data('submitted') === true) {
                    e.preventDefault();
                } else {
                    $(self.element).data('submitted', true);
                }
                return true;
            } else {
                return self.validate();
            }
        });

        $(this.element).find('input[type=submit]').on('click', function (e) {
            e.preventDefault();
            self.button_submit = true;
            self.validate();
        });

        $(this.element).find('.form-group').append('<div class="laravel-ajax-validation-help-block help-block with-errors"></div>');

        $(this.element).find(':input').each(function () {
            $(this).on('change', function () {
                self.validate()
            });
        });

        if (this.options.on_start) {
            this.validate();
        }

        if (this.options.auto_focus) {
            $(this.element).find(':input:enabled:visible:first').focus();
        }
    };

    Plugin.prototype.validate = function () {
        var data = $(this.element).serializeArray();
        data.push({ name: 'class', value: this.options.validation_request_class });
        data.push({ name: 'action', value: $(this.element).attr('action') });
        data.push({ name: 'method', value: $('input[name=_method]', this.element).length ? $('input[name=_method]', this.element).val() : $(this.element).attr('method') || 'get' });

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.name == "_method") {
                data.splice(i, 1);
            }
        }

        var self = this;

        $.ajax({
            url: this.options.validation_url,
            type: 'post',
            data: $.param(data),
            dataType: 'json',
            success: function (data) {
                if (data.success) {

                    $.each($(self.element).serializeArray(), function (i, field) {
                        var father = $(self.element).find('#' + field.name).parents('.form-group');
                        father.removeClass('has-error');
                        father.addClass('has-success');
                        father.find('.laravel-ajax-validation-help-block.help-block').html('');
                    });

                    self.validated = true;

                    if (self.button_submit) {
                        $(self.element).submit();
                    }
                } else {
                    var error_fields = [];

                    $.each(data.errors, function (key, data) {
                        var field = $(self.element).find('#' + key);
                        var father = field.parents('.form-group');
                        father.removeClass('has-success');
                        father.addClass('has-error');
                        father.find('.laravel-ajax-validation-help-block.help-block').html(data[0]);
                        error_fields.push(key);
                    });

                    $.each($(self.element).serializeArray(), function (i, field) {
                        if ($.inArray(field.name, error_fields) === -1) {
                            var father = $(self.element).find('#' + field.name).parent('.form-group');
                            father.removeClass('has-error');
                            father.addClass('has-success');
                            father.find('.laravel-ajax-validation-help-block.help-block').html('');
                        }
                    });

                    self.validated = false;
                    self.button_submit = false;
                }
            },
            error: function (xhr) {
                console.log(xhr.status);
            }
        })
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);