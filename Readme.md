# laravel-form-ajax-validation
Make ajax validation with Laravel Requests for forms with bootstrap

See the [full documentation.](https://github.com/guicho0601/laravel-form-ajax-validation/wiki)

O la
[Documentación en español](https://github.com/guicho0601/laravel-form-ajax-validation/wiki/Inicio)

##Installation

### 1. Composer

Add to the composer of your project

```console
composer require lrgt/laravel-form-ajax-validation
```

Or edit your composer.json

```json
"require": {
    "lrgt/laravel-form-ajax-validation": "dev-master"
},
```

### 2. Add the ServiceProvider

Open the file config/app.php

```php
"providers": {
    ...
    'Lrgt\LaravelFormAjaxValidation\LaravelFormAjaxValidationServiceProvider',
    ...
},
```

### 3. Publish vendor resources

You need to publish the necessary views for create the scripts of jQuery

```console
$ php artisan vendor:publish
```

### 4. Laravel Request

Create a request

```console
$ php artisan make:Request TestRequest
```

Add the rules

```php
public function rules()
{
	return [
          'name'=>'required|max:5',
          'description'=>'required',
          'tags'=>'required|min:3',
	];
}
```

You also can add to the request custom error messages and change de attributes name

```php
public function messages()
{
	return [
          'name.required'=>'Do not forget your name',
          'description.required'=>'You need the description',
          'name.max'=>'Your name have less than 5 letters?',
	];
}

public function attributes(){
        return [
            'name'=>'Your name',
            'tags'=>'The tags',
        ];
    }
```

### 5. Add to the view

Create your form

```html
<form method="post" action="<?=url('save_form')?>" id="myform">
    <input type="hidden" name="_token" value="<?=csrf_token()?>">
    <div class="form-group">
        <label for="nombre">Name</label>
        <input type="text" name="name" id="name" class="form-control">
    </div>
    <div class="form-group">
        <label for="descripcion">Description</label>
        <textarea type="text" name="description" id="description" rows="5" class="form-control">
        </textarea>
    </div>
    <div class="form-group">
        <label for="tags">Tags</label>
        <input type="text" name="tags" id="tags" class="form-control">
    </div>
    <input type="submit" value="Save" class="btn btn-success">
</form>
```

Add the jQuery and include the view that have the ajax script

```javascript
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
@include('vendor.lrgt.ajax_script', ['form' => '#myform',
'request'=>'App/Http/Requests/TestRequest','on_start'=>true])
```

You need jQuery 1.11.2 or higher

> Where #myform is the id of your form and request is the namespace of your Request.
> Onstart is just if you want that the validation work from the load of the page.
>__Note:__ Put the namespace of the request separate with `/`

![Preview validation](http://i1277.photobucket.com/albums/y485/guicho0601/Captura%20de%20pantalla%202015-06-02%20a%20las%2022.15.51_zpsvm5wevpp.png)

***

### Author

- __Name:__ Luis Ramos
- __Email:__ guicholarg@gmail.com

### License

The laravel-form-ajax-validation library is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
