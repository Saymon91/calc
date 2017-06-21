<?php

namespace Calc\CalcBundle\Controller;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends DefaultController
{
    public function indexAction():Response
    {
        return $this->render('CalcCalcBundle:Show:admin.index.html.twig', [], new Response(null, 200));
    }

    public function elementsAction():Response
    {
        return $this->render('CalcCalcBundle:Show:admin.elements.html.twig', [], new Response(null, 200));
    }

    public function referencesAction():Response
    {
        return $this->render('CalcCalcBundle:Show:admin.options.html.twig', [], new Response(null, 200));
    }
}