<?php

namespace Calc\WebBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $references = $this->container->get('calc_api.references');
        var_dump($references);
        $data = [];
        $data['references'] = $references->getReferences();
        print_r($data);
        return $this->render('CalcWebBundle:Default:index.html.twig');
    }
}
