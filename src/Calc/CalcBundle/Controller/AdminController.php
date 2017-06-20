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
        $options = $this->getDoctrine()->getRepository('CalcCalcBundle:References')->findAll();
        $elements = $this->getDoctrine()->getRepository('CalcCalcBundle:Elements')->findAll();
        $parameters = ['elements' => $elements, "options" => $options];
        return $this->render('CalcCalcBundle:Show:admin.elements.html.twig', $parameters, new Response(null, 200));
    }
}