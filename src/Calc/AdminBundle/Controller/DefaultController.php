<?php

namespace Calc\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\{Request, Response};

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('CalcAdminBundle:Default:index.html.twig');
    }

    public function testAction() {
        $input = "https://www.somehost.com/test/index.html?param1=4&param2=3&param3=2&param4=1&param5=3";
        $delete = 3;
        $arr = explode('?', $input);
        $query = [];
        foreach ($arr[1] as $value) {

        }
        print('<pre>');
        print_r($input);
        print('</pre>');
        return new Response();
    }
}
