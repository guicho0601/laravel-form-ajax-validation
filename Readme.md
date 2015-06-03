# laravel-form-ajax-validation
Make ajax validation with Laravel Requests for forms with bootstrap

## 1. Configuration

Add to the composer of your project

```console
composer require 'lrgt/laravel-form-ajax-validation:dev-master'
```

Or edit your composer.json

```json
"require": {
    ...
    "lrgt/laravel-form-ajax-validation": "dev-master",
    ...
},
```
## 2. Publish vendor resources

You need to publish the necessary views for create the scripts of jQuery

```console
$ php artisan vendor:publish
```

## 3. Laravel Request

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

## 4. Add to the view

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
@include('vendor.ajax-validation.ajax_script', ['form' => '#myform','request'=>'App/Http/Requests/TestRequest'])
```

You need jQuery 1.11.2 or higher

> Where #myform is the id of your form and request is the namespace of your Request.
>**Note: ** Put the namespace of the request separate with `/`

***

### Author

- **Name: ** Luis Ramos
- **Email: ** guicholarg@gmail.com

### License

The laravel-form-ajax-validation library is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
