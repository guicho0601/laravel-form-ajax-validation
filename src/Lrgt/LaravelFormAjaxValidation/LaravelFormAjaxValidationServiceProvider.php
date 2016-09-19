<?php namespace Lrgt\LaravelFormAjaxValidation;

use App;
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
        include base_path('app/Http/routes.php');

        Route::post('validation',function(Request $request){
            // create a new request
            $formActionRequest = Request::create($request->input('action'), $request->input('method'));
            // feed the route collection
            $matchingFormActionRoute = App::make('Illuminate\Routing\Router')->getRoutes()->match($formActionRequest);
            // merge route parameters with the input
            $request->merge($matchingFormActionRoute->parameters());

            $class = $request->input('class');
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
            __DIR__.'/assets' => public_path('vendor/lrgt'),
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
