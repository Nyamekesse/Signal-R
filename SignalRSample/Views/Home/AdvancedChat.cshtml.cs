using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace SignalRSample.Views.Home
{
    public class AdvancedChat : PageModel
    {
        private readonly ILogger<AdvancedChat> _logger;

        public AdvancedChat(ILogger<AdvancedChat> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}