<?php

namespace PrestoCalc\MainBundle\Controller;

use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class FrontController extends Controller
{
    public function indexAction($city = null)
    {
        $data = $this->get('presto_calc_main.defaultdata')->getData();

        if (!in_array($city, $data['cities'])) {
            $city = $this->container->getParameter('presto_calc_main.default_city');
        }

        $data['dates'] = array(
            'start' => new DateTime('first day of next month'),
            'end' => new DateTime('last day of next month'),
        );

        return $this->render('PrestoCalcMainBundle:Front:index.html.twig', array(
            'data' => $data,
            'city' => $city,
        ));
    }
}
