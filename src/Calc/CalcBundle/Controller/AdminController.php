<?php

namespace Calc\CalcBundle\Controller;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends DefaultController
{
    public function indexAction():Response
    {
        $parameters = [];
        return $this->render('', $parameters, new Response(null, 200));
    }
}