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
        print_r($data);
        if (isset($data['new'])) {

        }
        return $this->toJson();
    }

    public function add(array $item = []):References
    {
        $manager = $references = $this->getDoctrine()->getManager();
        $setItem = new Elements();
        foreach (Elements::FIELDS as $value)
        {
            if (isset($item[$value])) {
                $setter = "set".ucfirst($value);
                if (method_exists($setItem, $setter))
                {
                    $setItem->$setter($item[$value]);
                }
            }
        }

        print('<pre>');
        print_r($setItem->getFields());
        print('<pre>');

        $manager->persist($setItem);
        $manager->flush();

        print('<pre>');
        print_r($setItem->getFields());
        print('<pre>');

        return $setItem;
    }

    public function addAction(Request $request):Response
    {
        print('<pre>');
        print_r($request->request->all());
        print('</pre>');
        return $this->toJson([]);
    }
}
