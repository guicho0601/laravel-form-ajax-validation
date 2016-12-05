<?php namespace Lrgt\LaravelFormAjaxValidation;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class LaravelFormAjaxValidationServiceProvider extends ServiceProvider {

	/**
	 * Indicates if loading of the provider is deferred.
	 *
	 * @var bool
	 */
	protected $defer = false;

	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register()
	{
        include __DIR__.'/../../../../../../routes/web.php';
        Route::post('validation',function(Request $request){
            $class = $request->class;
            $class = str_replace('/','\\',$class);
            $my_request = new $class();
            $validator = Validator::make($request->all(),$my_request->rules(),$my_request->messages());
            $validator->setAttributeNames($my_request->attributes());
            if($request->ajax()){
                if ($validator->fails())
                {
                    return response()->json(array(
                        'success' => false,
                        'errors' => $validator->getMessageBag()->toArray()

                    ));
                }else{
                    return response()->json(array(
                        'success' => true,
                    ));
                }
            }
        });
        $this->publishes([
            __DIR__.'/views' => base_path('resources/views/vendor/lrgt'),
        ]);
	}

	/**
	 * Get the services provided by the provider.
	 *
	 * @return array
	 */
	public function provides()
	{
		return [];
	}

}
