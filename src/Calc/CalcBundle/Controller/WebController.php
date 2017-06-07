<?php

namespace Calc\CalcBundle\Controller;
use Symfony\Component\HttpFoundation\Response;

class WebController extends ReferencesController
{
    public function indexAction():Response
    {
        $parameters = [];
        $references = $this->getReferences();
        $parameters['user'] = 'admin';
        $parameters['elements'] = [];
        $parameters['categories'] = [];
        $parameters['references'] = $references;
        foreach($references as $value)

        return $this->render('CalcCalcBundle:Show:index.html.twig', $parameters, new Response(null, 200));
    }
};