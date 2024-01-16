Developer exercise: put a point on a map!
The existing WebDC3 web interface (http://eida.gfz-potsdam.de/webdc3/) features a dynamic map which allows a user to move around and zoom in on particular features of interest. 
The FDSN web service "fdsnws-station" provides coordinates (latitude, longitude) of seismic stations, with either a text or XML response. Here‘s a typical text response:

#Network|Station|Latitude|Longitude|Elevation|SiteName|StartTime|EndTime 
CX|HMBCX|-20.27822|-69.88791|1152.0|IPOC Station Humberstone, Chile|2006-11-21T00:00:00| 
CX|MNMCX|-19.13108|-69.59553|2304.0|IPOC Station Minimi, Chile|2006-11-27T00:00:00| 
CX|PATCX|-20.82071|-70.15288|832.0|IPOC Station Patache, Chile|2006-12-01T00:00:00| 
CX|PB01|-21.04323|-69.4874|900.0|IPOC Station Huatacondo, Chile|2006-02-21T00:00:00|

There is generally one line per station; some lines have been removed.This response was obtained from the request:
https://geofon.gfz-potsdam.de/fdsnws/station/1/query?network=CX&level=station&format=text 

The fdsnws-station API is documented at http://fdsn.org/webservices/fdsnws-station-1.1.pdf

Here a network means a group of seismic stations with a common two-character code, such as “CX”. We'd like you to produce a basic web page with an interactive map. 
It should address some or all of the following:
● You should be able to select a single station from a particular network, say ”CX“, as a list (or some similar control you think is visually proper) and show that station as a feature on the map.
● Can you allow the user to choose from any network available at the server? Hint: use level=network.
● Can you also display some of the extra information available in the fdsnws-station output, in a visually understandable way on your map?
● What would you do if you had to display 1000 such stations? 10000?
● Extra: Can you show the output from fdsnws-station displaying all stations of a particular network, CX as above, in a tabular form, such as a tab in the page?

You should be able to demonstrate your running code somewhere, and to explain your design and code to us.
Your code will be not be used for any other purpose, and our copies will be deleted after the interview process is completed.
    
