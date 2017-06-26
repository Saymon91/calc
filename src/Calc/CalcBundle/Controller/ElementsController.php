<?php
/**
 * Created by PhpStorm.
 * User: semen
 * Date: 14.06.17
 * Time: 21:07
 */

namespace Calc\CalcBundle\Controller;
use Symfony\Component\HttpFoundation\{Request, Response};
use Calc\CalcBundle\Entity\Elements;

class ElementsController extends DefaultController
{
    public function getElements(): array
    {
        $result = [];
        $elements = $this->getDoctrine()->getManager()->getRepository('CalcCalcBundle:Elements');
        $list = $elements->findAll();
        foreach ($list as $value)
        {
            $result[] = $value->getFields();
        }

        return $result;
    }

    public function listAction():Response
    {
        $result = ['error' => null, 'data' => null];
        try
        {
            $result['data'] = $this->getElements();
            return $this->toJson($result);
        }
        catch (\Exception $error)
        {
            print($error->getMessage());
            $result['error'] = ['code' => 500, 'message' => 'Internal error'];
            return $this->toJson($result);
        }
    }

    public function updateAction(Request $request):Response
    {
        $data = json_decode($request->request->get('data'));
        $manager = $this->getDoctrine()->getManager();
        $elements = $manager->getRepository('CalcCalcBundle:Elements');

        foreach($data as $id => $value)
        {
            $element = $elements->find($id);
            if (!$element) {
                $element = new Elements();
            }

            property_exists($value, 'name') && $element->setName($value->name);
            property_exists($value, 'label') && $element->setLabel($value->label);
            $element->setOptions([
                "required" => property_exists($value, 'required') ? $value->required : [],
                "additional" => property_exists($value, 'additional') ? $value->additional : []
            ]);

            $manager->persist($element);
        }

        $manager->flush();

        return $this->toJson(["data" => $elements->findAll()]);
    }
}
