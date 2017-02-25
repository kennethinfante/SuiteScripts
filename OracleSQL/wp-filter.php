<?php

add_filter('wpcf7_form_action_url', 'wpcf7_custom_form_action_url');
function wpcf7_custom_form_action_url($url)
{
    global $post;
    var_dump($post);
    if($post->ID === 20) {
        return "https://forms.netsuite.com/app/site/crm/externalleadpage.nl?compid=894408&amp;formid=35&amp;h=AACffht_rHq197liLx6_VLuGCENf2jmgO5A%3D";
    } elseif ($post->ID === 68) {
    	return "https://forms.netsuite.com/app/site/crm/externalleadpage.nl?compid=894408&amp;formid=35&amp;h=AACffht_rHq197liLx6_VLuGCENf2jmgO5A%3D";
    } else {
	    return $url;
    }
}


<option selected="" value=""></option>
<option value="1">Painter/Artist's Apprentice</option>
<option value="2">SEO Specialist</option>
<option value="3">Copy Writer</option>
<option value="4">Outbound Sales Representative</option>
<option value="5">PHP Web Developer</option>
<option value="6">Caspio Programmer</option>
<option value="7">Graphic Designer</option>
<option value="8">Sales Support</option>
<option value="9">Executive Assistant</option>
<option value="9">Netsuite Database Administrator</option>

https://forms.netsuite.com/app/site/crm/externalcustrecordpage.nl?compid=894408&formid=36&h=AACffht_M32fzk3n_LX1UNEYxy85MAt95TM%3D

<option selected="" value=""></option>
<option value="1">New</option>
<option value="2">Reviewed</option>
<option value="3">Phone Screened</option>
<option value="4">Interviewed</option>
<option value="5">Offer Made</option>
<option value="6">Rejected</option>
<option value="7">Keep For Reference</option>